# Scrapbox Extractor

## Overview

- Extract text from pages updated in the last week from Scrapbox
- Mask specific keywords that may contain personal information
- Output the data in CSV format

## Installation

To install the necessary dependencies, run:

```sh
npm install
```

## Usage

To start the application, run:

```sh
npm start
```

## Environment Variables

The following environment variables need to be set in a `.env` file:

- `SCRAPBOX_PROJECT_NAME`: Your Scrapbox project name
- `SCRAPBOX_COOKIE`: Cookie for Scrapbox authentication (connect.sid=xxxxx)
- `MASK_KEYWORDS`: Keywords for masking personal information (comma-separated)
- `OUTPUT_CSV_PATH`: File path for the output CSV

Example `.env` file:

```sh
# Scrapbox settings
SCRAPBOX_PROJECT_NAME=your_project_name
# Scrapbox authentication cookie (connect.sid=xxxxx)
SCRAPBOX_COOKIE="connect.sid=xxxxxxx"
# Keywords for masking personal information (comma-separated)
MASK_KEYWORDS=keyword1,keyword2,keyword3
# Output file path for CSV
OUTPUT_CSV_PATH=./output.csv
```
