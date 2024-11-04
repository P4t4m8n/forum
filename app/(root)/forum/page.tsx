import { StarkWolfSvg } from "@/components/icons/svgs";
import { getForums } from "@/lib/actions/forum.actions";
import { IForum } from "@/models/forum.model";
import Link from "next/link";

export default async  function ForumServer() {

  const forums: IForum[] = await getForums();
  console.log("forums:", forums);
  return   <div>
  <header></header>

  <nav>
    {forums.map((forum) => (
      <Link key={forum.id} href={`/forum/${forum.id}`}>
        <StarkWolfSvg/>
        <div>
          <h3>{forum.title}</h3>
          <p>{forum.description}</p>
          <ul>
            {forum.subjects.map((subject) => (
              <li key={subject}>{subject}</li>
            ))}
          </ul>
        </div>
        <ul>
          <li>
            <h4>Lorem ipsum, dolor sit amet consectetur</h4>
            <h5>9h</h5>
          </li>
          <li>
            <h4>Lorem ipsum, dolor sit amet consectetur</h4>
            <h5>Nov 1</h5>
          </li>
          <li>
            <h4>Lorem ipsum, dolor sit amet consectetur</h4>
            <h5>Yesterday</h5>
          </li>
        </ul>
      </Link>
    ))}
  </nav>
</div>;
}
