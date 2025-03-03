'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";

interface DashboardBreadcrumbsProps {
    // TODO: Add if extra styling is needed
}

const DashboardBreadcrumbs: React.FC<DashboardBreadcrumbsProps> = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  const breadcrumbItems = pathSegments.map((segment, index, array) => { // Get array in map for index check
    const breadcrumbName = transformPathSegmentToReadable(segment);
    const pathToSegment = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isLastItem = index === array.length - 1;

    return (
      <React.Fragment key={segment}> {/* Use Fragment to group item and separator */}
        <BreadcrumbItem className="capitalize">
            {isLastItem ? (
                <BreadcrumbPage>{breadcrumbName}</BreadcrumbPage> // Render BreadcrumbPage for last item
            ) : (
                <BreadcrumbLink href={pathToSegment}>{breadcrumbName}</BreadcrumbLink> // Render BreadcrumbLink for others
            )}
        </BreadcrumbItem>
        {!isLastItem && (
          <BreadcrumbSeparator className="hidden md:block" />
        )}
      </React.Fragment>
    );
  });

  return (
    <Breadcrumb>
    <BreadcrumbList>
        {breadcrumbItems}
    </BreadcrumbList>
  </Breadcrumb>
  );
};

// Helper function to transform path segments to readable titles
const transformPathSegmentToReadable = (segment: string): string => {
  return segment
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

export default DashboardBreadcrumbs;