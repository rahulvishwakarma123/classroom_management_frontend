import {
  Refine
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier
} from "@refinedev/react-router";
import { BookOpen, Home } from "lucide-react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Layout } from "./components/refine-ui/layout/layout";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import Dashboard from "./pages/Dashboard/Dashboard";

import SubjectsList from "./pages/Subjects/List";
import SubjectsCreate from "./pages/Subjects/Create";
import { dataProvider } from "./provider/data";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "XmjtQH-791rYV-WUNdK3",
              }}
              resources={[
                {
                  name: 'dashboard',
                  list: '/',
                  meta: {label : 'Home', icon: <Home/>}
                },
                {
                  name: 'subjects',
                  list: '/subjects',
                  create : '/subjects/create',
                  meta: {label: 'Subjects', icon: <BookOpen/>}
                }
              ]}
            >
              <Routes>
                <Route element={
                  <Layout>
                    <Outlet/>
                  </Layout>
                }>
                  <Route path='/' element={<Dashboard/>} />
                  <Route path="/subjects"
                    >
                      <Route index element={<SubjectsList/>}/>
                      <Route path="create" element={<SubjectsCreate/>}/>
                      </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
