'use client'

import { Card, Image, Link } from "@heroui/react";
import { button as buttonStyles } from "@heroui/theme";


export default function GithubStats() {
  return (
    <div className="flex flex-col gap-4 w-full xl:w-1/2">
      <div className={`${buttonStyles({ variant: "bordered", radius: "full" })} w-fit flex items-center justify-center`}>
        <div className="w-4 h-4">
          <img src={'star.svg'} className="dark:invert" alt="Star Icon" />
        </div>
        <span className="text-xs">Github</span>
      </div>
      <div className="flex flex-col w-full">
        <Link isExternal href="https://github.com/fphaikal">
          <Card className="flex flex-row items-center w-full">
            <Image
              src="https://github-readme-stats.vercel.app/api?username=fphaikal&hide_title=false&hide_rank=false&show_icons=true&include_all_commits=true&count_private=true&disable_animations=false&theme=transparent&title_color=17C964&text_color=74DFA2&locale=en&hide_border=true"
              alt="GitHub Stats"

            />
            <Image src="https://github-readme-stats.vercel.app/api/top-langs?username=fphaikal&locale=en&hide_title=false&layout=compact&langs_count=10&theme=transparent&title_color=17C964&text_color=74DFA2&hide_border=true" height={150} alt="languages graph" />
          </Card>
        </Link>
        {/* <Card>
              <Image src="https://statsme.vercel.app/api/wakatime?username=fphaikal&hide_border=true&theme=transparent&icon_color=ffb886&title_color=ffb886&text_color=fcfeff&range=last_7_day&langs_count=4" height={150} alt="streak graph" />
            </Card> */}
      </div>
    </div>
  )
}