import { Inject, Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { HfInference } from '@huggingface/inference';
import { downloadListOfUrls } from 'crawlee';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

// const inference = new HfInference(process.env.HF_TOKEN);

@Injectable()
export class AppService {
  // private crawler: any;
  constructor(
    // @Inject('crawler') private readonly crawler: any,
    private readonly config: ConfigService,
  ) {
    const client = new OpenAI({ apiKey: this.config.get('openaiAPIKey') });
  }
  getHello(): string {
    return 'Hello World!';
  }

  async getBPProductPages(): Promise<string[]> {
    const products = await downloadListOfUrls({
      url: 'https://www.beautypie.com/sitemap-pim.xml',
    });
    return products.filter((element) => element.includes('/products/'));
  }

  async getCTProductPages(): Promise<string[]> {
    const productElements = await fetch(
      'https://www.charlottetilbury.com/uk/sitemaps/uk_sitemap.xml',
    )
      .then((res) => res.text())
      .then((res) => {
        const dom = new JSDOM(res);
        return dom.window.document.querySelectorAll('url loc');
      });
    return Array.from(productElements)
      .map((element) => element.textContent)
      .filter((element) => element.includes('/uk/product/'));
  }
}
