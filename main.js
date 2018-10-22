const Apify = require('apify');
const rp = require('request-promise');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const imgConvert = require('image-convert');
const Promise = require('bluebird');
const typeis = require('type-is');

const SUPPORTED_TYPES = {
    png: 'png',
    jpeg: 'jpeg',
    jpg: 'jpg',
};
const SUPPORTED_TYPES_ARRAY = Object.keys(SUPPORTED_TYPES);

const fromBuffer = Promise.promisify(imgConvert.fromBuffer);

// Converts image response from JPEG to PNG format.
const convertToPng = async (response) => {
    switch (typeis.is(response, SUPPORTED_TYPES_ARRAY)) {
        case SUPPORTED_TYPES.png:
            return response.body;
        case SUPPORTED_TYPES.jpeg:
        case SUPPORTED_TYPES.jpg:
            return await fromBuffer({
                buffer: response.body.toString('base64'),
                quality: 100,
                output_format: 'png',
                size: 'original',
            });
        default:
            throw new Error(`Unsupported image content type "${contentType}". Supported: ${SUPPORTED_TYPES_ARRAY.join(', ')}`);
    }
};

Apify.main(async () => {
    const {
        imageUrl1,
        imageUrl2,
        outputAsJpeg = true,
        options = {},
    } = await Apify.getValue('INPUT');

    if (!imageUrl1) throw new Error('Parameter "input.imageUrl1" must be provided!');
    if (!imageUrl2) throw new Error('Parameter "input.imageUrl2" must be provided!');

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

    // Create PNG representations.
    const png1 = PNG.sync.read(pngBuffer1);
    const png2 = PNG.sync.read(pngBuffer2);
    const diffPng = new PNG({ width: png1.width, height: png1.height });


    pixelmatch(png1.data, png2.data, diffPng.data, png1.width, png1.height, options);
    const diffBuffer = PNG.sync.write(diffPng);

    // Output as PNG.
    if (!outputAsJpeg) return await Apify.setValue('OUTPUT', diffBuffer, { contentType: 'image/png; charset=utf-8' });

    // Output as JPEG.
    const outputJpeg = await fromBuffer({
        buffer: diffBuffer.toString('base64'),
        quality: 90,
        output_format: 'jpg',
        size: 'original',
    });
    await Apify.setValue('OUTPUT', outputJpeg, { contentType: 'image/jpeg; charset=utf-8' });
});
