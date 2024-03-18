import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import fruitList from "@/public/fruitList.jpg"
import bucketList from "@/public/bucketList.jpg" 
import fruitChaatList from "@/public/fruitChaatList.jpg"
import logo from "@/public/logo.jpg"

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { TeamMember, teamMembers } from "@/lib/team";
import { CarouselWithIndicators } from "@/components/custom/carouselWithIndicators";

const TeamCard: React.FC<{member: TeamMember}> = ({member}) => {

  return (
    <Card className="w-full h-fit md:h-auto p-4 xs:p-6 md:p-8 lg:p-12 bg-accent dark:bg-background">
      <div className="flex flex-row items-center sm:flex-col gap-4 md:gap-8">
        <div className="w-full flex-1 min-[500px]:h-full md:w-full max-w-[16rem] aspect-square">
          <Avatar className="w-full h-full">
            <AvatarImage src={member.src} />
            <AvatarFallback className="text-4xl">TS</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col flex-[2_0_0] md:flex-1 gap-2">
          <CardTitle className="text-xl lg:text-3xl">{member.name}</CardTitle>
          <CardDescription className="text-xs xs:text-sm sm:text-md lg:text-xl">{member.quote}</CardDescription>
        </div>
      </div>
    </Card>
  )
}

export default function Home() {
  
  return (  
    <div className="flex flex-col gap-8 w-full p-8 lg:p-16 lg:gap-20 sm:p-12 sm:gap-16">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <Image src={logo} alt="logo" className="hidden md:block max-w-[16rem] lg:max-w-sm bg-secondary rounded-full aspect-square"/>
        <div className="flex-[2_0_0] text-md sm:text-lg md:text-base lg:text-xl xl:text-2xl flex flex-col gap-4 xl:gap-8">
          <div className="flex gap-4 items-center">
            <div className="h-20 aspect-square md:hidden">
              <Image src={logo} alt="logo" className="rounded-xl aspect-square"/>
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-3xl lg:text-5xl xl:text-6xl font-bold tracking-widest"><span className="hidden lg:inline-block">Welcome to</span> Nustfruta</h1>
          </div>
          <p>Welcome to NustFruta, where freshness meets convenience. Discover a world of delicious and nutritious fruits, carefully selected and delivered straight to your doorstep. Embrace a healthier lifestyle with our premium selection of fresh fruits. Lets start your journey to a happier, healthier you.</p>
          <p>Indulge in a delightful array of fruits sourced from trusted growers, ensuring premium quality and unparalleled freshness. Begin your journey with NustFruta and experience the taste of pure goodness today.</p>
          <p className="text-muted-foreground italic font-semibold">Good Fruit comes at a cost. But great Health is Priceless.</p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-8">
        <div className="flex gap-4 justify-between items-center">
          <h1 className="text-2xl lg:text-5xl xl:text-6xl font-bold tracking-widest text-center">Our Menu</h1>
          <Link href="/new" className="bg-primary text-primary-foreground text-center rounded-md p-2 md:p-3 md:text-2xl lg:text-3xl lg:p4 text-xl font-semibold text-mono">Order Now</Link>
        </div>
        <CarouselWithIndicators 
        itemClassName="xs:basis-1/2 md:basis-1/3 flex justify-center" 
        contentClassName="" 
        indicatorClassName="md:hidden"
        items={[
          <Image src={fruitList} key={"Fruit List"} alt="Fruit List" className="rounded-xl"/>,
          <Image src={bucketList} key={"Bucket List"} alt="Bucket List" className="rounded-xl"/>,
          <Image src={fruitChaatList} key={"Fruit Chaat List"} alt="Fruit Chaat List" className="rounded-xl"/>
        ]} />
      </div>
      
      <Separator />
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold tracking-widest text-center">Our Team</h1>
        <CarouselWithIndicators 
        contentClassName="-ml-4 sm:-ml-8 md:-ml-12" 
        itemClassName="sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4 pl-4 sm:pl-8 md:pl-12 flex justify-center"
        items={teamMembers.map(member => <TeamCard key={member.name} member={member} />)} />
      </div>

    </div>
  );
}
