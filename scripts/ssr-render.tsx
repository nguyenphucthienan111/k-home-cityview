import React from "react";
import ReactDOMServer from "react-dom/server";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import HomeView from "../src/components/HomeView";
import ProjectDetailView from "../src/components/ProjectDetailView";
import UnitDetailView from "../src/components/UnitDetailView";
import ProjectsView from "../src/components/ProjectsView";
import CalculatorView from "../src/components/CalculatorView";
import AboutView from "../src/components/AboutView";
import ContactView from "../src/components/ContactView";

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
