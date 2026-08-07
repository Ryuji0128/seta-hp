import React from "react";
import { Box } from "@mui/material";
import { data, ListItem, Paragraph } from "./privacy-policy-data";

const PrivacyPolicy: React.FC = () => {
  // 型ガード関数
  const isParagraph = (item: ListItem): item is Paragraph => {
    return (item as Paragraph).type === "paragraph";
  };

  // 再帰的にリストを描画
  const renderItems = (items: ListItem[], parentKey: string) => {
    return (
      <Box
        component="ol"
        sx={{
          listStyleType: "decimal",
          listStylePosition: "inside",
          ml: "1rem",
          my: "1rem",
        }}
      >
        {items.map((item, index) => {
          const uniqueKey = `${parentKey}-${index}`;

          if (typeof item === "string") {
            return (
              <Box
                component="li"
                key={uniqueKey}
                sx={{ "&&": { my: "0.5rem", lineHeight: 1.625 } }}
              >
                {item}
              </Box>
            );
          } else if (Array.isArray(item)) {
            return <React.Fragment key={uniqueKey}>{renderItems(item, uniqueKey)}</React.Fragment>;
          } else if (isParagraph(item)) {
            return (
              <React.Fragment key={uniqueKey}>
                {item.content.map((line, lineIndex) => (
                  <Box
                    component="p"
                    key={`${uniqueKey}-${lineIndex}`}
                    sx={{ "&&": { my: "0.5rem", lineHeight: 1.625 } }}
                  >
                    {line}
                  </Box>
                ))}
              </React.Fragment>
            );
          }
          return null;
        })}
      </Box>
    );
  };

  return (
    <>
      {data.map((section, sectionIndex) => (
        <section key={sectionIndex}>
          <h2>{`第${sectionIndex + 1}条 (${section.title})`}</h2>
          {section.description && <p>{section.description}</p>}
          {renderItems(section.listItems as ListItem[], `section-${sectionIndex}`)}
        </section>
      ))}
    </>
  );
};

export default PrivacyPolicy;
