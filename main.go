package main

import (
	"compress/gzip"
	"fmt"
	brotli "github.com/google/brotli/go/cbrotli"
	flag "github.com/spf13/pflag"
	"io"
	"log"
	"os"
	"path/filepath"
	"regexp"
)

var (
	folder string
	match  = regexp.MustCompile("(.xml|.html|.css|.svg|.json|.js)$")
)

func main() {
	flag := flag.NewFlagSet("compress", flag.ContinueOnError)
	flag.String(folder, "folder", "Folder to compress recursively")
	walk()
}

func brFile(s string, c chan string) {
	minifiedContent, err := os.Open(s)
	if err != nil {
		log.Println(err)
	}
	defer minifiedContent.Close()
	compressedDest, err := os.Create(s + ".br")
	if err != nil {
		log.Println(err)
	}
	params := brotli.WriterOptions{
		Quality: 10}
	brWrite := brotli.NewWriter(compressedDest, params)
	defer brWrite.Close()
	io.Copy(brWrite, minifiedContent)
	c <- s
}

func gzipFile(s string, c chan string) {
	minifiedContent, err := os.Open(s)
	if err != nil {
		log.Println(err)
	}
	defer minifiedContent.Close()
	compressedDest, err := os.Create(s + ".gz")
	if err != nil {
		log.Println(err)
	}
	gzipWrite := gzip.NewWriter(compressedDest)
	defer gzipWrite.Close()
	io.Copy(gzipWrite, minifiedContent)
	c <- s
}

func walk() {
	files := make(chan string)
	filesFound := 0
	filesCompressed := 0
	err := filepath.Walk("test",
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			if valid, _ := isValid(path); valid && !info.IsDir() {
				go gzipFile(path, files)
				go brFile(path, files)
				filesFound += 2
			}
			return nil
		})
	for {
		fmt.Println(<-files)
		filesCompressed++
		if filesCompressed == filesFound {
			break
		}
	}
	if err != nil {
		log.Println(err)
	}
}

func isValid(path string) (bool, error) {
	regex := match.Match([]byte(path))
	return regex, nil
}
