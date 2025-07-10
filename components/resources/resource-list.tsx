"use client";

import { GroupedResources } from "@/lib/data/resources";
import { ResourceCard } from "./resource-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ResourceListProps {
  groupedResources: GroupedResources;
}

export function ResourceList({ groupedResources }: ResourceListProps) {
  const grades = Object.keys(groupedResources);

  if (grades.length === 0) {
    return <p>No resources found.</p>;
  }

  return (
    <Accordion type="multiple" className="w-full">
      {grades.map((grade) => (
        <AccordionItem value={`grade-${grade}`} key={grade}>
          <AccordionTrigger className="text-xl font-bold">
            {grade}
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple" className="w-full pl-4">
              {Object.keys(groupedResources[grade]).map((subject) => (
                <AccordionItem value={`${grade}-${subject}`} key={subject}>
                  <AccordionTrigger className="text-lg font-semibold">
                    {subject}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="multiple" className="w-full pl-4">
                      {Object.keys(groupedResources[grade][subject]).map(
                        (type) => (
                          <AccordionItem
                            value={`${grade}-${subject}-${type}`}
                            key={type}
                          >
                            <AccordionTrigger className="text-md font-medium capitalize">
                              {type}
                            </AccordionTrigger>
                            <AccordionContent>
                              {groupedResources[grade][subject][type].map(
                                (resource) => (
                                  <ResourceCard
                                    resource={resource}
                                    key={resource.id}
                                  />
                                ),
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ),
                      )}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
