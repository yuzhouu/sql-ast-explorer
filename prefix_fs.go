package main

import (
	"fmt"
	"io/fs"
	"net/http"
)

type prefixFS struct {
	prefix  string
	innerFS http.FileSystem
}

func (f prefixFS) Open(name string) (http.File, error) {
	name = fmt.Sprintf("%s%s", f.prefix, name)
	return f.innerFS.Open(name)
}

func newFs(fsys fs.FS, prefix string) http.FileSystem {
	return prefixFS{
		prefix:  prefix,
		innerFS: http.FS(fsys),
	}
}
