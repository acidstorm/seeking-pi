## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## DB

Start the postgres database, run `docker-compose up -d`

Run the command below to enable the vector extension

```sql
CREATE EXTENSION vector;
```

Create each product table
```sql
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS products_id_seq;

-- Table Definition
CREATE TABLE "public"."tablename" (
    "id" int4 NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    "product_sku" varchar,
    "description" text,
    "description_embedding" vector,
    "ingredients" text,
    "ingredients_embedding" vector,
    "url" text,
    "title" varchar,
    "subtitle" varchar,
    PRIMARY KEY ("id")
);

```
## Running the application

Update `configuration.ts` with config settings

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

To crawl CT, make a GET request to `/products/ct`.

To crawl BP, make a GET request to `/products/bp`

## Import
```bash
# node import.js <directory> <table>
```

## Search
```bash
# node recall.js 'search string'
```
or make a POST request to `/search`

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
