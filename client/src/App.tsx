/*
 * App — Observatorio de Indicadores de Género
 * Design: Global layout with sticky Header + main content + Footer
 * Routes: /, /indicadores, /metodologia, /glosario, /contacto
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { IndicatorsProvider } from "./contexts/IndicatorsContext";
import HeaderUCT from "./components/HeaderUCT";
import FooterUCT from "./components/FooterUCT";
import Home from "./pages/Home";
import Indicadores from "./pages/Indicadores";
import IndicadorPage from "./pages/IndicadorPage";
import Metodologia from "./pages/Metodologia";
import Glosario from "./pages/Glosario";
import Contacto from "./pages/Contacto";
import Calendario from "./pages/Calendario";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/indicadores" component={Indicadores} />
      <Route path="/indicador/:id" component={IndicadorPage} />
      <Route path="/metodologia" component={Metodologia} />
      <Route path="/glosario" component={Glosario} />
      <Route path="/contacto" component={Contacto} />
      <Route path="/calendario" component={Calendario} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <IndicatorsProvider>
          <TooltipProvider>
            <Toaster position="top-right" />
            <div className="flex flex-col min-h-screen">
              <HeaderUCT />
              <main className="flex-1">
                <Router />
              </main>
              <FooterUCT />
            </div>
          </TooltipProvider>
        </IndicatorsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
