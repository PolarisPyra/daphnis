import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Patcher = () => {
  return (
    <div>
      <Head>
        <title>CHUNITHM Patching Tools</title>
        <meta charSet="utf-8" />
        <link rel="stylesheet" href="/patcher/css/style.css" />
      </Head>

      <div className="icons">
        <Link href="/patcher/chuni.html" className="gameicon">
          <Image
            src="/patcher/img/chu/ni01.png"
            alt="CHUNITHM"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chuniplus.html" className="gameicon">
          <Image
            src="/patcher/img/chu/ni02plus.png"
            alt="CHUNITHM PLUS"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chuniair.html" className="gameicon">
          <Image
            src="/patcher/img/chu/ni03air.png"
            alt="CHUNITHM AIR"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chuniairplus.html" className="gameicon">
          <Image
            src="/patcher/img/chu/ni04airplus.png"
            alt="CHUNITHM AIR PLUS"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chunistar.html" className="gameicon">
          <Image
            src="/patcher/img/chu/ni05star.png"
            alt="CHUNITHM STAR"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chunistarplus.html" className="gameicon">
          <Image
            src="/patcher/img/chu/ni06starplus.png"
            alt="CHUNITHM STAR PLUS"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chuniamazon.html" className="gameicon">
          <Image
            src="/patcher/img/chu/ni07amazon.png"
            alt="CHUNITHM AMAZON"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chuniamazonplus.html" className="gameicon">
          <Image
            src="/patcher/img/chu/ni08amazonplus.png"
            alt="CHUNITHM AMAZON PLUS"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chunicrystal.html" className="gameicon">
          <Image
            src="/patcher/img/chu/ni09crystal.png"
            alt="CHUNITHM CRYSTAL"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chunicrystalplus.html" className="gameicon">
          <Image
            src="/patcher/img/chu/ni10crystalplus.png"
            alt="CHUNITHM CRYSTAL PLUS"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chuniparadise.html" className="gameicon">
          <div className="image-wrapper">
            <Image
              src="/patcher/img/chu/ni11paradise.png"
              alt="CHUNITHM PARADISE"
              width={120}
              height={120}
            />
          </div>
        </Link>
        <Link href="/patcher/ni11paradiselost.html" className="gameicon">
          <div className="image-wrapper">
            <Image
              src="/patcher/img/chu/ni11paradiselost.png"
              alt="CHUNITHM PARADISE LOST"
              width={120}
              height={120}
            />
          </div>
        </Link>
        <Link href="/patcher/chusannew.html" className="gameicon">
          <Image
            src="/patcher/img/chu/san12.png"
            alt="CHUNITHM NEW!!"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chusannewplus.html" className="gameicon">
          <Image
            src="/patcher/img/chu/san13newplus.png"
            alt="CHUNITHM NEW PLUS!!"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chusansun.html" className="gameicon">
          <Image
            src="/patcher/img/chu/san14sun.png"
            alt="CHUNITHM SUN"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chusansunplus.html" className="gameicon">
          <Image
            src="/patcher/img/chu/san15sunplus.png"
            alt="CHUNITHM SUN PLUS"
            width={120}
            height={120}
          />
        </Link>
        <Link href="/patcher/chusanluminous.html" className="gameicon">
          <Image
            src="/patcher/img/chu/san16luminous.png"
            alt="CHUNITHM LUMINOUS"
            width={120}
            height={120}
          />
        </Link>
      </div>
      <center className="pt-8">
        <div className="tagline">
          Chuni patches sourced from various online patchers
        </div>
        <div className="tagline">
          Chusan patches created with{" "}
          <a href="https://gitea.tendokyu.moe/beerpsi/CHUNITHM-Patch-Finder">
            CHUNITHM-Patch-Finder
          </a>
        </div>
        <div className="tagline">
          <em>
            Original web patcher by <a href="https://github.com/mon/">mon</a>
          </em>
        </div>
      </center>
    </div>
  );
};

export default Patcher;
