package main

import (
	"compress/gzip"
	"fmt"
	brotli "github.com/google/brotli/go/cbrotli"
	"io"
	"log"
	"os"
	"path/filepath"
)

func main() {
	walk()
}

func brFile(s string) {
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

}

func gzipFile(s string) {
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

}

func walk() {
	err := filepath.Walk("test",
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if !info.IsDir() {
				fmt.Println(path, info.Size())
				gzipFile(path)
				brFile(path)
			}
			return nil
		})
	if err != nil {
		log.Println(err)
	}
}
