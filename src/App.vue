<script setup>
import NavBarLayout from "./layouts/NavBarLayout.vue";
import { Icon } from '@iconify/vue';
</script>

<template>
  <NavBarLayout />
  <section id="home" class="pt-32">
    <div class="container mx-auto">
      <div class="flex flex-wrap">
        <div class="w-full self-center px-4 lg:w-1/2">
          <h1 class="text-base font-semibold md:text-xl text-primary">
            Hello👋, I'm
            <span class="block pt-1 font-bold text-4xl lg:text-5xl text-dark">Fahreza Pasha Haikal</span>
          </h1>
          <p class="text-slate-500 font-medium pt-1 pb-2 lg:pb-5 lg:pt-2 leading-relaxed">
            Seorang anak SMK yang sedang mencari jalan menuju masa depan.
          </p>

          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg"
            class="relative inline-block h-10 w-10 me-5 grayscale hover:grayscale-0" alt="Tailwind CSS">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg"
            class="relative inline-block h-auto w-10 me-5 grayscale hover:grayscale-0" alt="Bootstrap">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg"
            class="relative inline-block h-10 w-10 me-5 grayscale hover:grayscale-0" alt="Vite">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg"
            class="relative inline-block h-10 w-10 me-5 grayscale hover:grayscale-0" alt="">
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg"
            class="relative inline-block h-10 w-10 grayscale hover:grayscale-0" alt="">
        </div>
        <div class="w-full self-end pt-4 lg:pt-0 px-4 lg:w-1/2">
          <img src="./assets/fph.png" class="object-cover object-center h-auto w-56 md:w-96  mx-auto" alt="" />
        </div>
      </div>
    </div>
  </section>
  <section id="about" class="pt-28 pb-28 bg-dark">
    <div class="container mx-auto">
      <div class="flex flex-wrap">
        <div class="w-full self-center px-4">
          <h1 class="text-3xl font-bold text-center text-primary">
            <span class="text-white">Tentang</span> Saya
          </h1>
        </div>
      </div>
      <div class="flex flex-wrap pt-7">
        <div class="w-full md:w-1/2 px-4">
          <p class="text-base text-white">
            Halo. Nama saya Fahreza Pasha Haikal dan tolong panggil saya Haikal.
            Saya berasal dari Gresik dan saat ini saya sedang duduk di bangku
            kelas dua Teknik Mekatronika di SMK-SMTI Yogyakarta (Sekolah
            Menengah Kejuruan Teknologi Industri Yogyakarta). Saya lahir di
            Gresik pada tanggal 16 Desember 2006
          </p>
        </div>
        <div class="w-full md:w-1/2 pt-5 md:pt-0 px-4">
          <p class="text-base text-white">
            Saya sangat antusias terhadap dunia teknologi dan terus
            mengembangkan pengetahuan dan keterampilan di bidang ini. Namun,
            tidak hanya sebagai seorang teknisi mekatronika, saya juga memiliki
            minat yang kuat dalam desain grafis dan video editing. Saya telah
            mengasah kemampuan ini secara mandiri dan berhasil mengembangkannya
            sebagai keahlian sampingan yang saya geluti dengan penuh dedikasi.
          </p>
        </div>
      </div>
    </div>
  </section>
  <section id="certifications" class="pt-28 pb-28 bg-gray-50  ">
    <div class="container mx-auto">
      <div class="grid gap-3 md:gap-3 grid-cols-1 lg:grid-cols-3 px-4">
        <div>
          <div class="bg-gray-50 p-5 rounded-3xl self-stretch ">
            <h1 class="text-3xl font-bold text-center text-primary">
              Pendidikan
            </h1>
            <div
              class="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
              <div
                class="relative flex items-center gap-4 pt-0 pb-0 mx-0 mt-4 overflow-hidden text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border">
                <img
                  src="https://api.elearning.smtijogja.sch.id/api/v1/user-file/stream?file_uri=1859/other_information/ec98dacd-a086-4311-b383-0565d8c9c333.png"
                  alt="SMK SMTI Yogyakarta"
                  class="relative inline-block h-[58px] w-[58px] !rounded-full object-cover object-center" />
                <div class="flex w-full flex-col gap-0.5">
                  <div class="flex items-center justify-between">
                    <a href="https://www.smtijogja.sch.id/" target="_blank">
                      <h5 class="block text-xl antialiased font-semibold leading-snug tracking-normal text-dark">
                        SMK SMTI Yogyakarta
                      </h5>
                    </a>
                  </div>
                  <p class="block text-base antialiased font-light leading-relaxed text-blue-gray-900">
                    Teknik Mekatronika | Juli 2022 - Sekarang
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-5 rounded-3xl self-stretch  mt-3">
            <h1 class="text-3xl font-bold text-center text-primary">
              Organisasi
            </h1>
            <div
              class="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
              <div class="relative flex items-center gap-4 pt-0 pb-0 mx-0 mt-4 overflow-hidden text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border">
                <img src="https://api.elearning.smtijogja.sch.id/api/v1/user-file/stream?file_uri=1859/other_information/ec98dacd-a086-4311-b383-0565d8c9c333.png"
                  alt="SMK SMTI Yogyakarta"
                  class="relative inline-block h-[58px] w-[58px] !rounded-full object-cover object-center" />
                <div class="flex w-full flex-col gap-0.5">
                  <div class="flex items-center justify-between">
                    <h5 class="block text-xl antialiased font-semibold leading-snug tracking-normal text-dark">
                      Dana dan Usaha Chemicfest #7
                    </h5>
                  </div>
                  <p class="block text-base antialiased font-light leading-relaxed text-blue-gray-900">
                    Grafis Design | Maret 2023 - Mei 2023
                  </p>
                </div>
              </div>
              <div class="relative flex items-center gap-4 pt-0 pb-0 mx-0 mt-4 overflow-hidden text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border">
                <img src="https://api.elearning.smtijogja.sch.id/api/v1/user-file/stream?file_uri=1859/other_information/ec98dacd-a086-4311-b383-0565d8c9c333.png"
                  alt="SMK SMTI Yogyakarta"
                  class="relative inline-block h-[58px] w-[58px] !rounded-full object-cover object-center" />
                <div class="flex w-full flex-col gap-0.5">
                  <div class="flex items-center justify-between">
                    <h5 class="block text-xl antialiased font-semibold leading-snug tracking-normal text-dark">
                      Dekorasi dan Dokumentasi Chemicfest #8
                    </h5>
                  </div>
                  <p class="block text-base antialiased font-light leading-relaxed text-blue-gray-900">
                    Web Developer | Maaret 2024 - Mei 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 p-5 rounded-3xl">
          <h1 class="text-3xl font-bold text-center text-primary">
            Sertifikat
          </h1>
          <div class="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
            <div class="relative flex items-center gap-4 pt-0 mx-0 mt-4 overflow-hidden text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border">
              <img src="https://media.licdn.com/dms/image/C560BAQEvdugq213Fgw/company-logo_100_100/0/1630597820216/ef_english_first_indonesia_logo?e=1724284800&v=beta&t=p7VR5tR-4tcFqS497Fd_9gcZTgsptcdtt534YoLwE0s"
                alt="SMK SMTI Yogyakarta"
                class="relative inline-block h-[58px] w-[58px] !rounded-full object-cover object-center" />
              <div class="flex w-full flex-col gap-0.5">
                <div class="flex items-center justify-between">
                  <a href="https://www.efset.org/cert/opbECM" target="_blank">
                    <h5 class="block text-xl antialiased font-semibold leading-snug tracking-normal text-dark">
                      EF SET English Certificate 39/100 <br>
                      (A2 Elementary)
                    </h5>
                  </a>
                </div>
                <p class="block text-base antialiased font-light leading-relaxed text-blue-gray-900">
                  EF English First Indonesia
                  Issued Aug 2023
                </p>
              </div>
            </div>
          </div>
          <div class="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
            <div class="relative flex items-center gap-4 pt-0 mx-0 mt-4 overflow-hidden text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border">
              <img src="https://media.licdn.com/dms/image/D4D0BAQH1RYcj6YS4bw/company-logo_100_100/0/1697016830838/neris_analytics_limited_logo?e=1724284800&v=beta&t=NBEAz-_jU8SjNsCnoYI44eelcma6X4CoKooIjaCWnFo"
                alt="SMK SMTI Yogyakarta"
                class="relative inline-block h-[58px] w-[58px] !rounded-full object-cover object-center" />
              <div class="flex w-full flex-col gap-0.5">
                <div class="flex items-center justify-between">
                  <a href="https://www.16personalities.com/profiles/b2b6c5b51f12f" target="_blank">
                    <h5 class="block text-xl antialiased font-semibold leading-snug tracking-normal text-dark">
                      16Personalities.com: Mediator <br>(INFP-T)
                    </h5>
                  </a>
                </div>
                <p class="block text-base antialiased font-light leading-relaxed text-blue-gray-900">
                  NERIS Analytics Limited
                  Issued Sep 2022
                </p>
              </div>
            </div>
          </div>
          <div class="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
            <div class="relative flex items-center gap-4 pt-0 mx-0 mt-4 overflow-hidden text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border">
              <img src="https://media.licdn.com/dms/image/D4D0BAQHk6wxdrenCpg/company-logo_100_100/0/1698875993396/smalltalk2me_logo?e=1724284800&v=beta&t=DB-Y0qSONIYgqhsWZatVLPKMZGASQ7HQac0nBTDss_Y"
                alt="SMK SMTI Yogyakarta"
                class="relative inline-block h-[58px] w-[58px] !rounded-full object-cover object-center" />
              <div class="flex w-full flex-col gap-0.5">
                <div class="flex items-center justify-between">
                  <a href="https://app.smalltalk2.me/cert/5cc09ce4" target="_blank">
                    <h5 class="block text-xl antialiased font-semibold leading-snug tracking-normal text-dark">
                      SmallTalk English Speaking Level Test
                    </h5>
                  </a>
                </div>
                <p class="block text-base antialiased font-light leading-relaxed text-blue-gray-900">
                  SmallTalk2Me
                  Issued Mei 2024
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="bg-gray-50 p-5 rounded-3xl self-start">
            <h1 class="text-3xl font-bold text-center text-primary">
              Penghargaan
            </h1>
            <h5 class="block text-xl antialiased font-semibold leading-snug tracking-normal text-dark mt-4">
              Juara 2 Lomba Cerdas Cermat Al-Quran Juz 1
            </h5>
            <h5 class="block text-xl antialiased font-semibold leading-snug tracking-normal text-dark mt-2">
              Juara 3 Lomba Pembuatan Video Musik Khotmil Quran
            </h5>
          </div>
          <div class="bg-gray-50 p-5 rounded-3xl self-end mt-3">
            <h1 class="text-3xl font-bold text-center text-primary">
              Bahasa
            </h1>
            <div class="columns-3 mt-4">
              <h5 class="block text-xl antialiased font-semibold text-center leading-snug tracking-normal text-dark ">
                Indonesia
              </h5>
              <h5 class="block text-xl antialiased font-semibold text-center leading-snug tracking-normal text-dark ">
                Inggris
              </h5>
              <h5 class="block text-xl antialiased font-semibold text-center leading-snug tracking-normal text-dark">
                Jawa
              </h5>
            </div>
            <div class="columns-3 mt-1">
              <p class="text-slate-500 font-medium leading-relaxed text-center">
                Fasih
              </p>
              <p class="text-slate-500 font-medium leading-relaxed text-center">
                Menengah
              </p>
              <p class="text-slate-500 font-medium leading-relaxed text-center">
                Fasih
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section id="projects" class="pb-28 pt-28 bg-primary">
    <div class="container mx-auto">
      <h1 class="block text-dark text-3xl font-bold text-center">Projects</h1>
      <div class="flex flex-wrap justify-center">
        <div class="flex-col pt-10 gap-4 justify-center md:flex md:flex-row">
          <div class="card w-96 bg-dark text-white ">
            <div class="card-body">
              <h2 class="card-title mx-auto text-2xl pb-3">NatsLock</h2>
              <p>Natslock adalah Next Generation and Smart Lifestyle Locker yang menggunakan teknologi IoT yang di integrasikan dengan
                sisten rental sebagai tempat penyimpanan yang aman. Proyek ini dibuat untuk memenuhi nilai P5(Proyek Penguatan Profil Pelajar Pancasila)</p>
              <div class="card-actions justify-center pt-5">
                <div class="flex gap-3">
                  <a href="https://github.com/fphaikal/natslock" target="_blank">
                    <Icon icon="ri:github-fill" width="25" />
                  </a>
                  <a href="https://natslock.site" target="_bplank">
                    <Icon icon="lets-icons:out" width="25" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="card w-96 bg-dark text-white mt-3 md:mt-0">
            <div class="card-body">
              <h2 class="card-title mx-auto text-2xl pb-3">GASKAN</h2>
              <p>GASKAN adalah Gerbang Akses Pintar dan Kehadiran yang menggunakan teknologi IoT yang di integrasikan dengan
                sistem RFID sebagai akses masuk siswa. Sistem ini dapat mengatur akses pintu dan monitoring kehadiran siswa
                - siswa SMK SMTI Yogyakarta melalui website.</p>
              <div class="card-actions justify-center pt-5">
                <div class="">
                  <a href="https://smart-gate-system.vercel.app/" target="_blank">
                    <Icon icon="lets-icons:out" width="25" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card w-96 bg-dark text-white  mt-3 md:mt-0">
            <div class="card-body">
              <h2 class="card-title mx-auto text-2xl pb-3">Chemicfest #8 Website</h2>
              <p>Chemicfest#8 adalah sebuah event konser yang diadakan oleh SMK SMTI Yogyakarta. Website ini dibuat untuk
                mempromosikan event tersebut serta digunakan untuk melakukan pembayaran tiket. Website ini juga dilengkapi
                dengan livestreaming untuk menonton konser secara online.</p>
              <div class="card-actions justify-center pt-5">
                <div class="flex gap-3">
                  <a href="https://github.com/fphaikal/chemicfest-8" target="_blank">
                    <Icon icon="ri:github-fill" width="25" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-col md:flex pt-3 gap-4 justify-center md:flex-row">
          <div class="card w-96 bg-dark text-white mt-3 md:mt-0">
            <div class="card-body">
              <h2 class="card-title mx-auto text-2xl pb-3">Aqualifier</h2>
              <p>Aqualifier System adalah sebuah sistem yang berfungsi sebagai kontrol taman, meliputi penyiraman,
                pencahayaan, monitoring suhu dan ph. Sistem ini menggunakan teknologi IoT yang mengambil sumber listrik dari
                panel surya. sistem ini dapat dimonitoring serta dikontrol melalui website.</p>
              <div class="card-actions justify-center pt-5">
                <div class="flex gap-3">
                  <a href="https://github.com/fphaikal/aqualifier" target="_blank">
                    <Icon icon="ri:github-fill" width="25" />
                  </a>
                  <a href="https://www.aqualifier.my.id/" target="_blank">
                    <Icon icon="lets-icons:out" width="25" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="card w-96 bg-dark text-white">
            <div class="card-body">
              <h2 class="card-title mx-auto text-2xl pb-3">Instagram Downloader</h2>
              <p>Instagram Downloader adalah sebuah website yang dapat mendownload foto dan video dari instagram. Website
                ini digunakan untuk para user yang ingin mendownload postingan, reels, dll menggunakan link dari instagram.
              </p>
              <div class="card-actions justify-center pt-5">
                <div class="flex gap-3">
                  <a href="https://github.com/fphaikal/web-ig-downloader" target="_blank">
                    <Icon icon="ri:github-fill" width="25" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="card w-96 bg-dark text-white  mt-3 md:mt-0">
            <div class="card-body">
              <h2 class="card-title mx-auto text-2xl pb-3">VuePH</h2>
              <p>VuePH adalah website yang digunakan untuk menyaksikan live member JKT48 dan melihat history live yang
                sudah lewat. Website ini juga dilengkapi dengan fitur chat yang dapat digunakan untuk berinteraksi dengan
                member JKT48.
              </p>
              <div class="card-actions justify-center pt-5">
                <div class="flex gap-3">
                  <a href="https://github.com/fphaikal/VuePH" target="_blank">
                    <Icon icon="ri:github-fill" width="25" />
                  </a>
                  <a href="https://www.vueph.fphaikal.my.id/" target="_blank">
                    <Icon icon="lets-icons:out" width="25" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "App",
}
</script>
