//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { headerData } from "data";
import { IoLogoWhatsapp } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { useGetScrollPosition } from "@/hooks/useGetScrollPosition";
import { useCallback, useEffect, useRef, useState } from "react";
import About from "@/components/about";
import ContactForm from "@/components/contact";
import useWindowSize from "@/hooks/useWindowSize";
import styles from "@/styles/Landing.module.css";
import Image from "next/image";
import Banner from "../../public/images/banner.png";
import Banner1 from "../../public/images/banner1.png";
import Banner2 from "../../public/images/banner2.png";
import Help from "@/components/help";
import { useRouter } from "next/router";
import Footer from "@/components/footer";

export default function LandingPage() {
  const router = useRouter();
  const size = useWindowSize();
  const refMenu = useRef<HTMLUListElement>(null);
  const currentScroll = useGetScrollPosition();
  const [iconMenu, setIconMenu] = useState(true);

  const msg = `Olá!! Gostaria de realizar o agendamento para conhecer melhor o projeto social que a CEMIC faz.`;
  const zapHref = `https://api.whatsapp.com/send?phone=5561986573056&text=${encodeURIComponent(
    msg
  )}`;

  const openMenu = (e?: any) => {
    const list = refMenu?.current?.style;
    if (list?.display === "none" && size?.width! < 900) {
      list?.setProperty("display", "flex");
      setIconMenu(false);
    } else if (list?.display === "flex" && size?.width! < 900) {
      list?.setProperty("display", "none");
      setIconMenu(true);
    }
  };

  const scrollUp = useCallback(() => {
    const scroll_up = document.getElementById("scroll_up");
    if (currentScroll > 100) {
      scroll_up?.classList.add("show-scroll");
    } else scroll_up?.classList.remove("show-scroll");
  }, [currentScroll]);

  const getActiveScroll = useCallback(() => {
    const about = document?.getElementById("about");
    const help = document?.getElementById("help");
    const contact = document?.getElementById("contact");

    if (currentScroll > 30) about?.style?.setProperty("opacity", "1");
    if (currentScroll > help?.offsetHeight)
      help?.style?.setProperty("opacity", "1");
    if (currentScroll > contact?.offsetHeight)
      contact?.style?.setProperty("opacity", "1");
    if (currentScroll < contact?.offsetHeight)
      contact?.style?.setProperty("opacity", "0");
    if (currentScroll < help?.offsetHeight)
      help?.style?.setProperty("opacity", "0");
    if (currentScroll < 30) about?.style?.setProperty("opacity", "0");
  }, [currentScroll]);

  useEffect(() => {
    getActiveScroll();
  }, [currentScroll, getActiveScroll]);

  useEffect(() => {
    const changeRouter = () => {
      const list = refMenu?.current?.style;
      if (size?.width! > 900) list?.setProperty("display", "flex");
      else list?.setProperty("display", "none");
    };
    scrollUp();
    changeRouter();
  }, [scrollUp, size?.width]);

  const listItem = ({ item, index }: any) => {
    const handlePress = () => size?.width < 900 && router.push(item.path);
    return (
      <li key={index} className={styles["list-item"]} onClick={handlePress}>
        <a href={item.path}>{item.title}</a>
      </li>
    );
  };

  const renderIconMenu = () => {
    !iconMenu ? (
      <AiOutlineClose className={styles["icon-menu"]} onClick={openMenu} />
    ) : (
      <GiHamburgerMenu className={styles["icon-menu"]} onClick={openMenu} />
    );
  };

  const renderImageBanner = () => {
    size?.width! > 760 ? (
      <div className={styles.bannerback}>
        <Image
          src={Banner}
          width={size?.width}
          height={500}
          alt=""
          className={styles["image-banner"]}
        />
      </div>
    ) : (
      <div className={styles.bannerback}>
        <Image
          src={Banner2}
          width={size?.width}
          height={500}
          alt=""
          className={styles["image-banner"]}
        />
        <Image
          src={Banner1}
          width={size?.width}
          height={500}
          alt=""
          className={styles["image-banner"]}
        />
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>CEMIC</title>
        <meta
          name="description"
          content="Centro Médico e de Implantes Comunitário"
        />
        <meta name="author" content="Sofx Softwares Inteligentes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="cemic, cemicdf, implantes, implante comunitario, brasilia, cemic brasilia, ong, ongcemic, ong brasilia, ong dentes, dentes, protese, ortodontia"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles["header-container"]}>
        <img
          src="/images/cemicLogo.png"
          alt="cemic logo"
          className={styles.logocemic}
        />
        <ul className={styles["list-container"]} ref={refMenu}>
          {headerData.map((item, index) => {
            return listItem({ item, index });
          })}
        </ul>
        {renderIconMenu()}
      </div>
      <section className={styles.banner}>{renderImageBanner()}</section>
      <div className={styles["icone-seta"]} />
      <div style={{ marginBottom: "1rem" }}></div>

      <About />
      <Help />
      <ContactForm />
      <Footer />

      <a
        href={zapHref}
        className="scrollup"
        id="scroll_up"
        target={"_blank"}
        rel="noreferrer"
      >
        <IoLogoWhatsapp className="whatsapp" color="#34af23" />
      </a>
    </>
  );
}
