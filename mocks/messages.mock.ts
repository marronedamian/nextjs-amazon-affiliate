export const users = [
  {
    id: 1,
    name: "Victor Yoga",
    message: "You can check it...",
    time: "now",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Devon Lane",
    message: "I'll try my best von",
    time: "4m",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: 3,
    name: "Kristin Watson",
    message: "nice..",
    time: "23m",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
  },
];

export const messagesByUserId: Record<
  number,
  { id: number; from: string; text: string; time: string }[]
> = {
  1: [
    {
      id: 1,
      from: "Victor",
      text: "Hey! How's the project going?",
      time: "01:20 AM",
    },
    {
      id: 2,
      from: "You",
      text: "Got a few sketches. Will share soon.",
      time: "01:32 AM",
    },
  ],
  2: [
    {
      id: 1,
      from: "Devon",
      text: "Did you check the latest report?",
      time: "11:05 AM",
    },
    { id: 2, from: "You", text: "Yes! Looks great.", time: "11:07 AM" },
  ],
  3: [
    {
      id: 1,
      from: "Kristin",
      text: "Let me know when you’re free.",
      time: "6:15 PM",
    },
    { id: 2, from: "You", text: "Will do!", time: "6:20 PM" },
  ],
};
