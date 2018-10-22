# actor-imagediff

Returns an image containing difference of two given images. Internally uses [pixelmatch](https://www.npmjs.com/package/pixelmatch#pixelmatchimg1-img2-output-width-height-options) NPM package and supports all of its options.

Input consists of 2 images (PNG or JPEG) and other optional parameters:

```json
{
    "imageUrl1": "https://raw.githubusercontent.com/mapbox/pixelmatch/master/test/fixtures/4a.png",
    "imageUrl2": "https://raw.githubusercontent.com/mapbox/pixelmatch/master/test/fixtures/4b.png",
    "outputAsJpeg": false,
    "pixelmatchOptions": { "threshold": 0.1 }
}
```

Default output is an PNG image containing diff of given images. Using options `outputAsJpeg: true` the result my be switched to JPEG format. Parameter `pixelmatchOptions` may contain any parameters supported by [pixelmatch](https://www.npmjs.com/package/pixelmatch#pixelmatchimg1-img2-output-width-height-options) NPM package.