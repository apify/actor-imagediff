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

This actor can be used as [synchronous API](https://www.apify.com/docs/api/v2#/reference/actors/run-actor-synchronously/with-input) that returns diff image as response to POST request.

<table>
    <thead>
        <tr>
            <th colspan="2">Source images</th>
            <th>Diff</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><img src="https://apify-uploads-prod.s3.amazonaws.com/e6917240-0195-4b29-9681-3b6ec4a9d653_screencapture-apify-2018-10-30-15_49_12.png" style="max-width: 100%" /></td>
            <td><img src="https://apify-uploads-prod.s3.amazonaws.com/10bca866-90d7-42e5-a555-ba5a689bad47_screencapture-apify-2018-10-30-15_48_28.png" style="max-width: 100%" /></td>
            <td><img src="https://apify-uploads-prod.s3.amazonaws.com/b8b81c5d-bc30-44b9-8def-cba535106d66_OUTPUT.png" style="max-width: 100%" /></td>
        </tr>
    </tbody>
</table>
