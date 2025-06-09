import { Resvg } from '@resvg/resvg-js';
import satoriHtml from 'satori-html';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const handler = async (event) => {
  try {
    const html = JSON.parse(event.body).html;

    const parsed = satoriHtml(html);
    const fontData = await fs.readFile(path.join(__dirname, 'fonts', 'Inter-Regular.ttf'));

    const svg = await parsed.render({
      width: 1350,
      height: 1080,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    });

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1350,
      },
    });

    const pngData = resvg.render();
    const buffer = pngData.asPng();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="banner.png"',
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error: ${err.message}`,
    };
  }
};
