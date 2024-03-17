import logo from "@/public/logo.jpg"

export type TeamMember = {
  name: string
  quote: string
  src?: string
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Labib Kamran',
    quote: 'You have to believe in yourself when noone else does.',
    src: logo.src
  },
  {
    name: 'Muhammad Hammad',
    quote: 'An ordinary boy with extraordinary abilities.',
    src: logo.src
  },
  {
    name: 'Shahzil Asif',
    quote: 'You miss all the shots that you dont take.',
    src: logo.src
  },
  {
    name: 'Zain Ikhlaq',
    quote: 'The days are long but the decades are short.',
    src: logo.src
  },
  {
    name: 'Abdullah Ajmal',
    quote: 'Embrace the journey. Trust the Process.',
    src: logo.src
  },
  {
    name: 'Ahmad Abdul Qadir',
    quote: 'Guess what, Nobody Cares.',
    src: logo.src
  },
]