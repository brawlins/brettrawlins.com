---
title: "Rotate images in Go"
date: 2024-04-26
tags:
  - go
---

## Problem

While working on an image upload service, I noticed that sometimes images got saved with the wrong orientation. For example, you would upload a portrait image, but it was getting saved in landscape orientation (turned on its side).

It turns out that when you encode the image (e.g. using `jpeg.Encode()`), it removes most of the EXIF data, including the `Orientation` tag. Without any orientation data, the image will default to landscape unless the bytes are actually saved in the desired orientation.

I came up with two possible solutions:

1. Save the image in the desired orientation, so it always displays correctly (even without EXIF tags) - lossy
1. Set the desired EXIF `Orientation` tag after saving - not lossy

## Solution 1 - Rotate and save

In the end, this is the solution I went with because it seemed more robust. Although re-saving the image is a lossy process, there was no significant reduction in quality, and it was a one-and-done solution.

The actual process of rotating the image is more complicated than I wanted to deal with, so I ended up using the [disintegration/imaging](https://pkg.go.dev/github.com/disintegration/imaging) package. With that in place, it's basically a one-liner:

```go
rotatedImage = imaging.Rotate90(imageObject)
```

One thing to note is that this package provides functions that rotate the image counter-clockwise. In contrast, the [EXIF Orientation tag values](https://exiftool.org/TagNames/EXIF.html) use clockwise rotation. Just be aware of that when trying to map an EXIF `Orientation` value to the correct rotation function.

## Solution 2 - Set EXIF Orientation

This solution is a bit more work, but it has the benefit of not being lossy. You can easily rotate or flip an image without degrading its quality by setting the EXIF `Orientation` tag. For reading and writing EXIF tags you can use the awesome [dsoprea/go-exif](https://github.com/dsoprea/go-exif) package.

First, you need to get the original orientation so that you can set it again after resizing, or encoding, or whatever you're doing. Here's an example function that reads the `Orientation` tag from an image:

```go
import (
	"bytes"
	"strconv"

	exif "github.com/dsoprea/go-exif/v3"
	exifcommon "github.com/dsoprea/go-exif/v3/common"
	jis "github.com/dsoprea/go-jpeg-image-structure/v2"
)

// Returns the value of the Orientation tag as a string
func getOrientation(imageBytes []byte) (string, error) {
	rawExif, err := exif.SearchAndExtractExif(imageBytes)
	if err != nil {
		return "", err
	}

	im, err := exifcommon.NewIfdMappingWithStandard()
	if err != nil {
		return "", err
	}

	ti := exif.NewTagIndex()
	_, index, err := exif.Collect(im, ti, rawExif)
	if err != nil {
		return "", err
	}

	rootIfd := index.RootIfd
	results, err := rootIfd.FindTagWithName("Orientation")
	if err != nil {
		return "", err
	}

	ite := results[0]
	value, err := ite.FormatFirst()
	if err != nil {
		return "", err
	}

	return value, nil
}
```

Then, after you're done manipulating the image, you can save that orientation tag back to the EXIF data. Here's an example function that is basically taken straight from the [SetExif example](https://pkg.go.dev/github.com/dsoprea/go-jpeg-image-structure#example-SegmentList.SetExif) in the docs:

```go
import (
	"bytes"
	"strconv"

	exif "github.com/dsoprea/go-exif/v3"
	jis "github.com/dsoprea/go-jpeg-image-structure/v2"
)

// Writes the given value for the Orientation tag to the given image bytes
func setOrientation(imageBytes []byte, orientation string) ([]byte, error) {
	jmp := jis.NewJpegMediaParser()

	intfc, err := jmp.ParseBytes(imageBytes)
	if err != nil {
		return nil, err
	}

	sl := intfc.(*jis.SegmentList)

	rootIb, err := sl.ConstructExifBuilder()
	if err != nil {
		return nil, err
	}

	ifdPath := "IFD0"
	ifdIb, err := exif.GetOrCreateIbFromRootIb(rootIb, ifdPath)
	if err != nil {
		return nil, err
	}

	oint, _ := strconv.Atoi(orientation)
	oint16 := uint16(oint)
	err = ifdIb.SetStandardWithName("Orientation", []uint16{oint16})
	if err != nil {
		return nil, err
	}

	err = sl.SetExif(rootIb)
	if err != nil {
		return nil, err
	}

	b := new(bytes.Buffer)
	err = sl.Write(b)
	if err != nil {
		return nil, err
	}

	return b.Bytes(), nil
}
```
