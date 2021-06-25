const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const { promisify } = require('util');
const imgConvert = require('image-convert');
const typeis = require('type-is');

const fromBuffer = promisify(imgConvert.fromBuffer);
const { SUPPORTED_TYPES, SUPPORTED_TYPES_ARRAY, JPEG_QUALITY } = require('./consts');

/**
 * If image is one of the SUPPORTED_TYPES then converts it to PNG and returns it as buffer.
 * @param  {Object} response HTTP request response with an image.
 * @return {Promise<Buffer>}
 */
exports.convertToPng = async (response) => {
    const contentType = typeis.is(response, SUPPORTED_TYPES_ARRAY);

    switch (contentType) {
        case SUPPORTED_TYPES.png:
            return response.body;
        case SUPPORTED_TYPES.jpeg:
        case SUPPORTED_TYPES.jpg:
            return fromBuffer({
                buffer: response.body.toString('base64'),
                quality: 100,
                output_format: 'png',
                size: 'original',
            });
        default:
            throw new Error(`Unsupported image content type "${contentType}". Supported: ${SUPPORTED_TYPES_ARRAY.join(', ')}`);
    }
};

/**
 * Computes diff of given PNG image buffers.
 *
 * @param  {Buffer} pngBuffer1
 * @param  {Buffer} pngBuffer2
 * @param  {Object}  options
 * @return {Buffer}
 */
exports.imageDiff = (pngBuffer1, pngBuffer2, options) => {
    const png1 = PNG.sync.read(pngBuffer1);
    const png2 = PNG.sync.read(pngBuffer2);
    const diffPng = new PNG({ width: png1.width, height: png1.height });

    pixelmatch(png1.data, png2.data, diffPng.data, png1.width, png1.height, options);

    return PNG.sync.write(diffPng);
};

/**
 * Converts PNG to JPEG.
 * @param  {Buffer} pngBuffer
 * @return {Promise<Buffer>}
 */
exports.pngToJpeg = async (pngBuffer) => {
    return fromBuffer({
        buffer: pngBuffer.toString('base64'),
        quality: JPEG_QUALITY,
        output_format: 'jpg',
        size: 'original',
    });
};
