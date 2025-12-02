export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "React Summit 2025",
    image: "/images/event1.png",
    slug: "react-summit-2025",
    location: "Amsterdam, Netherlands",
    date: "June 13-17, 2025",
    time: "9:00 AM - 6:00 PM",
  },
  {
    title: "Global Hackathon Week",
    image: "/images/event2.png",
    slug: "global-hackathon-week",
    location: "San Francisco, CA",
    date: "July 20-27, 2025",
    time: "24 Hour Event",
  },
  {
    title: "Next.js Conf",
    image: "/images/event3.png",
    slug: "nextjs-conf",
    location: "Virtual & San Francisco",
    date: "October 24, 2025",
    time: "10:00 AM - 5:00 PM PST",
  },
  {
    title: "AI & Machine Learning Summit",
    image: "/images/event4.png",
    slug: "ai-ml-summit",
    location: "London, United Kingdom",
    date: "September 5-7, 2025",
    time: "8:30 AM - 7:00 PM",
  },
  {
    title: "JavaScript Meetup Berlin",
    image: "/images/event5.png",
    slug: "javascript-meetup-berlin",
    location: "Berlin, Germany",
    date: "May 15, 2025",
    time: "6:00 PM - 9:00 PM",
  },
  {
    title: "DevOps World Conference",
    image: "/images/event6.png",
    slug: "devops-world-conference",
    location: "Austin, TX",
    date: "August 12-14, 2025",
    time: "9:00 AM - 6:00 PM",
  },
];
