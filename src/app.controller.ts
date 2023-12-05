import { Body, Controller, Get,  Post } from '@nestjs/common';
import { AppService } from './app.service';
import { BeautyPieCrawler, CharlotteTilburyCrawler } from './crawler';
import { EmbeddingService } from './embedding';
import { search } from './db';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/products/bp')
  async getBPProducts(): Promise<string[]> {
    const runId = new Date().toISOString();

    const productPages = await this.appService.getBPProductPages();

    const bpCrawlerModule = new BeautyPieCrawler();
    await bpCrawlerModule.initialise(runId);
    const requestQueue = await bpCrawlerModule.crawler.getRequestQueue();
    requestQueue.addRequests(
      productPages
        .map((url) => ({ url, uniqueKey: `runId=${runId}|url=${url}` })),
    );
    bpCrawlerModule.crawl();

    return productPages;
  }

  @Get('/products/ct')
  async getCTProducts(): Promise<string[]> {
    const runId = new Date().toISOString();

    const productPages = await this.appService.getCTProductPages();
    const ctCrawlerModule = new CharlotteTilburyCrawler();
    await ctCrawlerModule.initialise(runId);
    const requestQueue = await ctCrawlerModule.crawler.getRequestQueue();
    requestQueue.addRequests(
      productPages.map((url) => ({ url, uniqueKey: `runId=${runId}|url=${url}` })),
    );
    ctCrawlerModule.crawl();
    return productPages;
  }

  @Post('/search')
  async productSearch(@Body() searchParams: {query: string}): Promise<any[]>{
    const embeddingService = new EmbeddingService()
    const embedding = await embeddingService.getEmbedding(searchParams.query)
    try{
      const products = await search(embedding)
      return products
    } catch (err) {
      };
    
  }
}
