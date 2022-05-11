# 🗑️📆 Trashcal

Trashcal is a small node module that parses the City of San Diego's trash collection
pages and produces an iCal file with events for trash, recycling, and greens days.

## Usage

```
npm install --save trashcal
```
and then

```typescript
import { trashcal } from 'trashcal';

// get the calendar by ID
const calendar = await trashcal({id: 'a4Ot0000001E8i4EAC' });
```

## Example: 

I do this in a Cloudflare worker, like so:

```typescript
import { trashcal } from 'trashcal';

export async function handleRequest(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  let id = searchParams.get('id');
  console.log(`got request for ${id}`)

  const calendar = await trashcal({id});

  const responseConfig = {
    headers: {
      'content-type': 'text/calendar;charset=UTF-8',
      'Content-Disposition': 'attachment; filename=trashcal.ics',
    },
  };

  return new Response(calendar.toString(), responseConfig)
}
```

## How it works

San Diego has all of the waste pickup info in [a Salesforce app](https://getitdone.force.com/apex/CollectionMapLookup) where you can
get either your PDF calendar with alternate Recycling and Greens weeks or get an HTML page with [your next pickup dates](https://getitdone.force.com/CollectionDetail?id=a4Ot0000001E8i4EAC). (For the record, I don't know who lives at 1234 Agate St. It was just the first address that popped up
when I searched `1234 A`). This library just loads that page, parses the HTML, and generates the `ICalCalendar` for you. 

There is a JSON representation of this information, but that would require parsing HTML to get the CSRF token anyway and I
worry that the Salesforce API would change. The city calls this a "bookmarkable page" so I believe this will be durable.

