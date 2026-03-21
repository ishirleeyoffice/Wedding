import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "sonner";
import App from "./app/App.tsx";
import { MealTicketStep1 } from "./app/pages/MealTicketStep1";
import { MealTicketStep2 } from "./app/pages/MealTicketStep2";
import { MealTicketConfirm } from "./app/pages/MealTicketConfirm";
import { MealTicketSelect } from "./app/pages/MealTicketSelect";
import { MealTicketResult } from "./app/pages/MealTicketResult";
import {RsvpSection} from "./app/components/RsvpSection.tsx";
import "./styles/index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/meal-ticket", element: <MealTicketStep1 /> },
  { path: "/meal-ticket/transfer", element: <MealTicketStep2 /> },
  { path: "/meal-ticket/confirm", element: <MealTicketConfirm /> },
  { path: "/meal-ticket/select", element: <MealTicketSelect /> },
  { path: "/meal-ticket/result", element: <MealTicketResult /> },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster position="bottom-center" />
    <RouterProvider router={router} />
  </>
);
