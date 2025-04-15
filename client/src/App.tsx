import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Research from "@/pages/Research";
import ResearchVertical from "@/pages/ResearchVertical";
import Team from "@/pages/Team";
import Students from "@/pages/Students";
import Publications from "@/pages/Publications";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import Chatbot from "@/components/Chatbot";
import DiagnosticTool from "@/components/DiagnosticTool";
import Debug from "@/pages/Debug";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/research" component={Research} />
          <Route path="/research/:category" component={ResearchVertical} />
          <Route path="/team" component={Team} />
          <Route path="/students" component={Students} />
          <Route path="/publications" component={Publications} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/contact" component={Contact} />
          <Route path="/diagnostic" component={DiagnosticTool} />
          <Route path="/debug" component={Debug} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;