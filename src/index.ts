import ical, {ICalAlarmType, ICalCalendar} from 'ical-generator';
import {HTMLElement, parse} from 'node-html-parser';

interface Pickup {
	name: string;
	date: string;
}

function createCalendar(pickups: Pickup[], alarmTime?: number): ICalCalendar {
	const calendar = ical({name: 'Trash Calendar'});

	for (const pickup of pickups) {
		const event = calendar.createEvent({
			start: pickup.date,
			summary: pickup.name,
			allDay: true,
		});

		if (alarmTime) {
			event.createAlarm({
				type: ICalAlarmType.display,
				trigger: alarmTime,
			});
		}
	}

	return calendar;
}

async function getHtml(id: string): Promise<HTMLElement> {
	const url = `https://getitdone.force.com/CollectionDetail?id=${id}`;
	const page = await fetch(url);
	const text = await page.text();
	return parse(text);
}

async function getDates(html: HTMLElement): Promise<Pickup[]> {
	// All the info is in a div with the class schedule
	const schedule = html.querySelectorAll('div.schedule div');
	const pickups = schedule
		.map(x => {
			// This is super brittle, but each div has an h3 title and a few paragraphs with the data
			const name = x.querySelectorAll('h3')[0].text.trim();
			const date = x.querySelectorAll('p')[2].text.trim();

			return {name, date};
		})
	// Some houses can't have greens pickup or recyling, so filter those out
		.filter(x => x.date !== '');

	return pickups;
}

export interface TrashcalOptions {
	id: string;
	alarmTime?: number;
}

export async function trashcal({id, alarmTime}: TrashcalOptions): Promise<ICalCalendar> {
	const html = await getHtml(id);
	const dates = await getDates(html);
	const calendar = createCalendar(dates, alarmTime);
	return calendar;
}
