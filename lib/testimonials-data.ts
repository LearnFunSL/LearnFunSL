export interface Testimonial {
  id: number;
  text: string;
  author: string;
  title: string;
  affiliation: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "LearnFun SL completely transformed my approach to studying. The past papers and AI chatbot helped me understand complex physics concepts easily!",
    author: "Kavitha Perera",
    title: "A/L Student",
    affiliation: "Ananda College, Colombo",
    rating: 5,
  },
  {
    id: 2,
    text: "As a teacher, I'm impressed by the quality of resources. The multilingual support helps me reach all my students effectively.",
    author: "Mr. Rajesh Kumar",
    title: "Mathematics Teacher",
    affiliation: "Royal College, Kandy",
    rating: 5,
  },
  {
    id: 3,
    text: "My daughter was struggling with her O/L preparation and feeling very stressed. LearnFun SL made learning fun again! The video lessons in Tamil really helped her understand better.",
    author: "Mrs. Priya Selvam",
    title: "Parent",
    affiliation: "Jaffna",
    rating: 5,
  },
  {
    id: 4,
    text: "The flashcards feature is amazing! I created custom decks for Biology terms and it helped me memorize everything faster. Plus, it's completely free!",
    author: "Saman Wickramasinghe",
    title: "A/L Student",
    affiliation: "Nalanda College, Colombo",
    rating: 5,
  },
  {
    id: 5,
    text: "The calendar feature keeps me organized with assignments and exam dates. The progress tracker motivates me to study consistently.",
    author: "Nimesha Fernando",
    title: "O/L Student",
    affiliation: "Visakha Vidyalaya, Colombo",
    rating: 5,
  },
  {
    id: 6,
    text: "The peer tutoring feature connected me with senior students who helped me with Chemistry. It's like having a personal tutor for free!",
    author: "Tharaka Rathnayake",
    title: "A/L Student",
    affiliation: "D.S. Senanayake College",
    rating: 5,
  },
];
