import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"

const events = [
    {
        image: "/images/event1.jpg",
        title: "Event 1",
    },

     {
        image: "/images/event2.jpg",
        title: "Event 2",
    },
   
]


const page = () => {
  return (
    <section>
      <h1 className="text-center mt-10">The Hub for every Dev <br />  Event you must not miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in one place</p>
      <ExploreBtn />
      <div className="mt-10 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
            {events.map((event) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  )
}

export default page