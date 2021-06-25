const Apify = require('apify');
const { pngToJpeg, imageDiff, convertToPng } = require('./tools');

const { requestAsBrowser } = Apify.utils;

Apify.main(async () => {
    const {
        imageUrl1,
        imageUrl2,
        outputAsJpeg = true,
        options = {},
        proxy = {},
    } = await Apify.getValue('INPUT');

    if (!imageUrl1) throw new Error('Parameter "input.imageUrl1" must be provided!');
    if (!imageUrl2) throw new Error('Parameter "input.imageUrl2" must be provided!');

    const proxyConfiguration = await Apify.createProxyConfiguration(proxy);

    // Request images.
    const [response1, response2] = await Promise.all(
        [imageUrl1, imageUrl2].map((url) => {
            return requestAsBrowser({
                url,
                responseType: 'buffer',
                proxyUrl: proxyConfiguration?.newUrl(`${Math.round(Math.random() * 1000)}`),
            });
        }),
    );

    // Convert to PNG if needed.
    const pngBuffer1 = await convertToPng(response1);
    const pngBuffer2 = await convertToPng(response2);

    // Compute diff.
    const diffBuffer = imageDiff(pngBuffer1, pngBuffer2, options);

    // Write output.
    const output = outputAsJpeg ? await pngToJpeg(diffBuffer) : diffBuffer;
    const contentType = outputAsJpeg ? 'image/jpeg; charset=utf-8' : 'image/png; charset=utf-8';
    await Apify.setValue('OUTPUT', output, { contentType });
});
