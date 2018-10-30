const Apify = require('apify');
const rp = require('request-promise');
const { pngToJpeg, imageDiff, convertToPng } = require('./tools');

Apify.main(async () => {
    const {
        imageUrl1,
        imageUrl2,
        outputAsJpeg = true,
        options = {},
    } = await Apify.getValue('INPUT');

    if (!imageUrl1) throw new Error('Parameter "input.imageUrl1" must be provided!');
    if (!imageUrl2) throw new Error('Parameter "input.imageUrl2" must be provided!');

    // Request images.
    const response1 = await rp({
        url: imageUrl1,
        resolveWithFullResponse: true,
        encoding: null,
    });
    const response2 = await rp({
        url: imageUrl2,
        resolveWithFullResponse: true,
        encoding: null,
    });

    // Convert to PNG if needed.
    const pngBuffer1 = await convertToPng(response1);
    const pngBuffer2 = await convertToPng(response2);

    // Compute diff.
    const diffBuffer = imageDiff(pngBuffer1, pngBuffer2, options);

    // Write output.
    const output = outputAsJpeg ? pngToJpeg(diffBuffer) : diffBuffer;
    const contentType = outputAsJpeg ? 'image/jpeg; charset=utf-8' : 'image/png; charset=utf-8';
    await Apify.setValue('OUTPUT', output, { contentType });
});
