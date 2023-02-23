/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { headerData } from "data";
import { IoLogoWhatsapp } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useGetScrollPosition } from "@/hooks/useGetScrollPosition";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import About from "@/components/about";
import ContactForm from "@/components/contact";
import useWindowSize from "@/hooks/useWindowSize";
import Modal from "@/components/modal";
import styles from "@/styles/Landing.module.css";
import modalStyle from "../styles/Modal.module.css";

export default function LandingPage() {
  const router = useRouter();
  const size = useWindowSize();
  const refMenu = useRef<HTMLUListElement>(null);
  const currentScroll = useGetScrollPosition();
  const [menuMobile, setMenuMobile] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  const msg = `Olá!! 
Gostaria de realizar o agendamento para conhecer melhor o projeto social que a CEMIC faz.`;
  const zapHref = `https://api.whatsapp.com/send?phone=5561986573056&text=${encodeURIComponent(
    msg
  )}`;

  const openMenu = useCallback(
    (e?: any) => {
      const list = refMenu?.current?.style;
      if (!menuMobile && size?.width! < 760) {
        setMenuMobile(true);
        list?.setProperty("display", "flex");
      } else if (menuMobile && size?.width! < 760) {
        setMenuMobile(false);
        list?.setProperty("display", "none");
      }
    },
    [menuMobile, size.width]
  );

  const scrollUp = useCallback(() => {
    const scroll_up = document.getElementById("scroll_up");
    if (currentScroll > 100) {
      scroll_up?.classList.add("show-scroll");
    } else scroll_up?.classList.remove("show-scroll");
  }, [currentScroll]);

  const changeRouter = useCallback(() => {
    const list = refMenu?.current?.style;
    if (size?.width! > 760) {
      setMenuMobile(false);
      list?.setProperty("display", "flex");
    }
  }, [size?.width]);

  useEffect(() => {
    scrollUp();
    changeRouter();
  }, [changeRouter, scrollUp]);

  const listItem = ({ item, index }: any) => (
    <li key={index} className={styles["list-item"]}>
      <a href={item.path}>{item.title}</a>
    </li>
  );
  const modalLogin = ({ item, index }: any) => {
    const handleClick = (e: any) => {
      e.preventDefault();
      setLoginModal(true);
    };
    return (
      <li key={index} className={styles["list-item"]}>
        <a style={{ cursor: "pointer" }} onClick={handleClick}>
          {item.title}
        </a>
      </li>
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
            if (index === headerData.length - 1) {
              return modalLogin({ item, index });
            } else return listItem({ item, index });
          })}
        </ul>

        <GiHamburgerMenu className={styles["icon-menu"]} onClick={openMenu} />
      </div>

      <section className={styles.banner}>
        <div className={styles["left-banner"]} />
        <div className={styles["right-banner"]} />
      </section>

      <About />

      <ContactForm />

      <footer className={styles.footer}>
        <div className={styles["container-footer"]}>
          <img
            src="images/logo.png"
            alt="sua logo"
            className={styles["logo-footer"]}
          />
          <h3>CEMIC© Compartilhe essa ideia!</h3>
          <p>Todos os direitos reservados.</p>
          <p>Contato: (61) 3083-3075 | (61) 98657-3056</p>
        </div>
      </footer>

      <a
        href={zapHref}
        className="scrollup"
        id="scroll_up"
        target={"_blank"}
        rel="noreferrer"
      >
        <IoLogoWhatsapp className="whatsapp" color="#7f5" />
      </a>

      <Modal visible={loginModal} closeModal={() => setLoginModal(false)}>
        <form className={modalStyle["login-form"]}>
          <h2>Entrar</h2>
        </form>
      </Modal>
    </>
  );
}
