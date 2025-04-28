"use client";

import { capitalize } from "@/lib/utils";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = decodeURIComponent(segment.replace(/-/g, " "));
    return {
      href,
      label: capitalize(label),
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map(({ href, label }, index) => {
          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index < crumbs?.length - 1 ? (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
