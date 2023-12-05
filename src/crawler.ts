import { CheerioCrawler, Dataset, RequestQueue } from 'crawlee';
import { EmbeddingService } from './embedding';
import { CONFIG } from './config/configuration';

abstract class Crawler {
  async initialise(_runId: string) {}
  async crawl() {}
}

export class BeautyPieCrawler implements Crawler {
  crawler: CheerioCrawler;
  async initialise(runId: string) {
    const embeddingService = new EmbeddingService();
    const dataset = await Dataset.open(`beautypie-${runId}`);

    this.crawler = new CheerioCrawler({
      requestQueue: await RequestQueue.open('beautypie-crawler'),
      maxConcurrency: 4,
      maxRequestsPerMinute: 40,
      maxRequestsPerCrawl: CONFIG.MAX_CRAWL ?? 300,
      async requestHandler({ request, $ }) {
        $('style').remove();

        const price = $('span:contains(Add To Bag)').text();
        const title = $('h1 p').first().text();
        const subtitle = $('h1 p').last().text();
        const lead = $('h1').siblings('p');
        const mainDescription = lead.next().text();
        const highlight = $('#tabs-pdpTabs--tabpanel-0 div').text();
        const description = `
        ${title}
        ${subtitle}
        ${lead.text()}
        ${mainDescription}
        ${highlight}`;
        const embedding = await embeddingService.getEmbedding(description);
        dataset.pushData({
          description,
          url: request.url,
          title,
          subtitle,
          price,
          embedding,
        });
      },
    });
  }
  async crawl() {
    this.crawler.run();
  }
  async export(runId: string) {
    const dataset = await Dataset.open(runId)
    dataset.exportToCSV(`${runId}.csv`);
  }
}

export class CharlotteTilburyCrawler implements Crawler {
  crawler: CheerioCrawler;

  async initialise(runId: string) {
    const embeddingService = new EmbeddingService();
    const dataset = await Dataset.open(`charlotte-tilbury-${runId}`);
    this.crawler = new CheerioCrawler({
      requestQueue: await RequestQueue.open('charlotte-tilbury-crawler'),
      maxConcurrency: 4,
      maxRequestsPerMinute: 40,
      maxRequestsPerCrawl: CONFIG.MAX_CRAWL ?? 300,
      async requestHandler({ request, $ }) {
        $('style').remove();

        const price = $(
          '.ProductSummaryPrice__price .DisplayPrice__price',
        ).text();
        const title = $('h1 span').first().text();
        const subtitle = $('h1 span').last().text();
        const mainDescription = $('.SellBlock__description').text();
        const highlight = $(
          '.ProductInformation #AccordionItem__content-id--0',
        ).text();
        if (!highlight.includes('SKU:')) {
          return;
        }
        const description = `
        ${title}
        ${subtitle}
        ${mainDescription}
        ${highlight}`;
        const embedding = await embeddingService.getEmbedding(description);

        // See /storage/datasets/{runId}
        dataset.pushData({
          description,
          url: request.url,
          title,
          subtitle,
          price,
          embedding,
        }); 
      },
    });
  }
  async crawl() {
    this.crawler.run();
  }
}

