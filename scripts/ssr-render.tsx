import React from "react";
import ReactDOMServer from "react-dom/server";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import HomeView from "../src/components/HomeView";
import ProjectDetailView from "../src/components/ProjectDetailView";
import UnitDetailView from "../src/components/UnitDetailView";
import ProjectsView from "../src/components/ProjectsView";
import CalculatorView from "../src/components/CalculatorView";
import NewsView from "../src/components/NewsView";
import AboutView from "../src/components/AboutView";
import ContactView from "../src/components/ContactView";
import NotFoundView from "../src/components/NotFoundView";
import ForbiddenView from "../src/components/ForbiddenView";
import ServerErrorView from "../src/components/ServerErrorView";
import VideoWatchView from "../src/components/VideoWatchView";

export function renderHomeHtml(): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/" }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(HomeView, { onNavigate: () => {} })
      ),
      React.createElement(Footer, null)
    )
  );
}

export function renderProjectHtml(slug: string): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/" + slug }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(ProjectDetailView, { slug, onNavigate: () => {} })
      ),
      React.createElement(Footer, null)
    )
  );
}

export function renderUnitHtml(projectSlug: string, unitSlug: string): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/" + projectSlug }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(UnitDetailView, { projectSlug, unitSlug, onNavigate: () => {} })
      ),
      React.createElement(Footer, null)
    )
  );
}

export function renderProjectsPageHtml(): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/san-pham" }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(ProjectsView, { onNavigate: () => {} })
      ),
      React.createElement(Footer, null)
    )
  );
}

export function renderCalculatorPageHtml(): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/tinh-tra-gop" }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(CalculatorView, { onNavigate: () => {} })
      ),
      React.createElement(Footer, null)
    )
  );
}

export function renderNewsPageHtml(): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/tin-tuc" }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(NewsView, { onNavigate: () => {} })
      ),
      React.createElement(Footer, null)
    )
  );
}

export function renderAboutPageHtml(): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/gioi-thieu" }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(AboutView, null)
      ),
      React.createElement(Footer, null)
    )
  );
}

export function renderContactPageHtml(): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/lien-he" }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(ContactView, null)
      ),
      React.createElement(Footer, null)
    )
  );
}

export function renderNotFoundHtml(): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/404" }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(NotFoundView, { onNavigate: () => {} })
      ),
      React.createElement(Footer, null)
    )
  );
}

export function renderForbiddenHtml(): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/403" }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(ForbiddenView, { onNavigate: () => {} })
      ),
      React.createElement(Footer, null)
    )
  );
}

export function renderServerErrorHtml(code = 500): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/" + code }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(ServerErrorView, { code, onNavigate: () => {} })
      ),
      React.createElement(Footer, null)
    )
  );
}

export function renderVideoWatchHtml(videoSlug: string): string {
  return ReactDOMServer.renderToString(
    React.createElement(
      "div",
      { className: "min-h-screen bg-white text-slate-800 flex flex-col font-sans" },
      React.createElement(Header, { currentHash: "/video/" + videoSlug }),
      React.createElement("main", { id: "main-content", className: "flex-grow" },
        React.createElement(VideoWatchView, { videoSlug, onNavigate: () => {} })
      ),
      React.createElement(Footer, null)
    )
  );
}
