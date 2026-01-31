import { Link } from "lucide-react";
import Image from "next/image";

interface Props {
    title: string;
    image: string;
    slug: string;
    date: string;
    time: string;
    location: string;
}

const EventCard = ({title, image, slug, date, time, location}: Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
        <Image src={image} alt={title} width={410} height={300} className="poster"/>
        
        <p className="title">{title}</p>
         
       
    </Link>
  )
}

export default EventCard