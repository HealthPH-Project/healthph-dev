import { NavLink } from "react-router-dom";
import EmptyState from "../../components/admin/EmptyState";
import Icon from "../../components/Icon";
import Input from "../../components/Input";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ScrollToTop from "../../components/ScrollToTop";
import Highlighter from "react-highlight-words";

const Help = () => {
  const user = useSelector((state) => state.auth.user);

  const [search, setSearch] = useState("");

  const TOCAdmin = [
    { id: "navigation", label: "Navigation", hasSubItems: false },
    { id: "analytics", label: "Analytics", hasSubItems: false },
    {
      id: "trends-map",
      label: "Trends Map",
      hasSubItems: true,
      subItems: [
        { id: "map", label: "Map" },
        { id: "list-view", label: "List View" },
        { id: "upload-dataset", label: "Upload Dataset" },
      ],
    },
    { id: "user-management", label: "User Management", hasSubItems: false },
    { id: "activity-logs", label: "Activity Logs", hasSubItems: false },
    { id: "settings", label: "Settings", hasSubItems: false },
  ];

  const TOCUser = [
    { id: "navigation", label: "Navigation", hasSubItems: false },
    { id: "analytics", label: "Analytics", hasSubItems: false },
    {
      id: "trends-map",
      label: "Trends Map",
      hasSubItems: true,
      subItems: [
        { id: "map", label: "Map" },
        { id: "list-view", label: "List View" },
      ],
    },
    { id: "settings", label: "Settings", hasSubItems: false },
  ];

  const TOC = ["ADMIN", "SUPERADMIN"].includes(user.user_type)
    ? TOCAdmin
    : TOCUser;

  const [tocActive, setTOCActive] = useState(false);
  const [tocAnimate, setTOCAnimate] = useState("");

  const handleAnimationEnd = (e) => {
    const toc = document.getElementById("toc");
    if (toc.classList.contains("hide-toc")) {
      setTOCAnimate("");
    }
  };

  const handleClick = () => {
    setTOCActive(!tocActive);
    setTOCAnimate(!tocAnimate ? "show-toc" : "hide-toc");
  };

  const handleSelectSection = (id) => {
    handleClick();
    document.getElementById(id).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const helpSectionsAdmin = [
    {
      sectionName: "Navigation",
      sectionId: "navigation",
      description: [
        {
          sectionDesc:
            "The application provides the admin a simple navigation to go through the dashboard. The three mains modules are the Analytics, Trends Map, and User Management. Moreover, the admin can monitor the user activities and manage their personal information in using the application.",
          sectionImage: <SampleImage />,
        },
      ],
    },
    {
      sectionName: "Analytics",
      sectionId: "analytics",
      description: [
        {
          sectionDesc:
            "Once every user have successfully signed in to HealthPH, the user is directed to the Analytics Page that are consist of summary of data, visualization charts, and many more. The user can filter the data by region and print them in PDF form.",
          sectionImage: <SampleImage />,
        },
      ],
    },
    {
      sectionName: "Trends Map",
      sectionId: "trends-map",
      description: [
        {
          sectionDesc:
            "The main module of HealthPH is the Trends Map. The admin is provided with a map of the Philippines to track suspected symptoms in all 17 administrative regions.",
          sectionImage: <SampleImage />,
        },
      ],
      subSections: [
        {
          sectionId: "map",
          sectionName: "Map",
          description: [
            {
              sectionDesc:
                "By navigating with the map, there are 4 types of colored circles called suspected symptoms. These 4 types of circles are plotted around the map of the Philippines and are categorized as Tuberculosis, Pneumonia, COVID, and AURI. In validating the date of these plotted suspected symptoms, there is a label indicating the recency of the data being displayed.",
              sectionImage: <SampleImage />,
            },
            {
              sectionDesc:
                "Moreover, the map allows every users to zoom in and out of the map and redirect them to their current location.",
              sectionImage: <SampleImage />,
            },
          ],
        },
        {
          sectionId: "list-view",
          sectionName: "List View",
          description: [
            {
              sectionDesc:
                "Other than viewing the data using the map, every user can view the data in list view. The list view provides the admin to filter the data by region/s, upload data sets, and view each suspected symptoms in a list.",
              sectionImage: <SampleImage />,
            },
          ],
        },
        {
          sectionId: "upload-dataset",
          sectionName: "Upload Dataset",
          description: [
            {
              sectionDesc:
                "To continue using the Trends Map with new data, the admin can upload a data set in CSV form and view past uploaded data set on the bottom with a table provided. The admin is also provided with instructions in providing the required data by using the CSV Template located on the top left side.",
              sectionImage: <SampleImage />,
            },
            {
              sectionDesc:
                "Once the admin have provided the required data using the CSV Template, the admin should proceed in clicking 'Upload CSV' then they will be required to do a final check of the CSV data they uploaded by displaying a preview of the table. Once the final check is done, they can proceed again in clicking 'Upload CSV.' After that, the data set will be updated and be displayed in the Trends Map",
              sectionImage: <SampleImage />,
            },
          ],
        },
      ],
    },
    {
      sectionName: "User Management",
      sectionId: "user-management",
      description: [
        {
          sectionDesc:
            "This module provides the admin and super admin to manage its users and themselves. The super admin and admin can add users and manage their status to use the application. However, only the super admin has the privilege to delete users in HealthPH.",
          sectionImage: <SampleImage />,
        },
      ],
    },
    {
      sectionName: "Activity Logs",
      sectionId: "activity-logs",
      description: [
        {
          sectionDesc:
            "This module provides every admin to monitor the user activities of all types of users.",
          sectionImage: <SampleImage />,
        },
      ],
    },
    {
      sectionName: "Settings",
      sectionId: "settings",
      description: [
        {
          sectionDesc:
            "This module provides every user to edit their personal information, email address, password, and the ability to delete their account. Moreover, every user can check their current status if they can use HealthPH. If a user's status is 'active', they can use the application with their respective privilege and user type. In the case of their status labeled as 'inactive', they are unable to navigate the application can only access the Settings module.",
          sectionImage: <SampleImage />,
        },
      ],
    },
  ];

  const helpSectionsUser = [
    {
      sectionName: "Navigation",
      sectionId: "navigation",
      description: [
        {
          sectionDesc:
            "The application provides the user a simple navigation to go through the dashboard. The two mains modules are the Analytics and Trends Map. Moreover, the user can manage their personal information in using the application.",
          sectionImage: <SampleImage />,
        },
      ],
    },
    {
      sectionName: "Analytics",
      sectionId: "analytics",
      description: [
        {
          sectionDesc:
            "Once every user have successfully signed in to HealthPH, the user is directed to the Analytics Page that are consist of summary of data, visualization charts, and many more. The user can filter the data by region and print them in PDF form.",
          sectionImage: <SampleImage />,
        },
      ],
    },
    {
      sectionName: "Trends Map",
      sectionId: "trends-map",
      description: [
        {
          sectionDesc:
            "The main module of HealthPH is the Trends Map. The admin is provided with a map of the Philippines to track suspected symptoms in all 17 administrative regions.",
          sectionImage: <SampleImage />,
        },
      ],
      subSections: [
        {
          sectionId: "map",
          sectionName: "Map",
          description: [
            {
              sectionDesc:
                "By navigating with the map, there are 4 types of colored circles called suspected symptoms. These 4 types of circles are plotted around the map of the Philippines and are categorized as Tuberculosis, Pneumonia, COVID, and AURI. In validating the date of these plotted suspected symptoms, there is a label indicating the recency of the data being displayed.",
              sectionImage: <SampleImage />,
            },
            {
              sectionDesc:
                "Moreover, the map allows every users to zoom in and out of the map and redirect them to their current location.",
              sectionImage: <SampleImage />,
            },
          ],
        },
        {
          sectionId: "list-view",
          sectionName: "List View",
          description: [
            {
              sectionDesc:
                "Other than viewing the data using the map, every user can view the data in list view. The list view provides the admin to filter the data by region/s, upload data sets, and view each suspected symptoms in a list.",
              sectionImage: <SampleImage />,
            },
          ],
        },
      ],
    },
    {
      sectionName: "Settings",
      sectionId: "settings",
      description: [
        {
          sectionDesc:
            "This module provides every user to edit their personal information, email address, password, and the ability to delete their account. Moreover, every user can check their current status if they can use HealthPH. If a user's status is 'active', they can use the application with their respective privilege and user type. In the case of their status labeled as 'inactive', they are unable to navigate the application can only access the Settings module.",
          sectionImage: <SampleImage />,
        },
      ],
    },
  ];

  const getContent = () => {
    return ["ADMIN", "SUPERADMIN"].includes(user.user_type)
      ? helpSectionsAdmin
      : helpSectionsUser;
  };

  const [searchWords, setSearchWords] = useState([]);

  // useEffect(() => {
  //   const splitSearchWords = search.split(" ");
  //   const sW = splitSearchWords.filter((s) => s.length > 0);
  //   setSearchWords(sW);
  // }, [search]);

  return (
    <>
      <div className="admin-wrapper flex flex-col h-full">
        <div className="header flex-col sm:flex-row">
          <div className="breadcrumbs-wrapper me-[16px]">
            <div className="breadcrumb-item">
              <NavLink to="/dashboard/help">Help</NavLink>
              <Icon
                iconName="ChevronRight"
                height="16px"
                width="16px"
                fill="#A1ACB8"
                className="icon"
              />
            </div>
          </div>
          <div className="flex items-start sm:items-center mt-[20px] sm:mt-0 flex-col sm:flex-row">
            <Input
              size="input-md"
              id="search"
              additionalClasses="w-full max-w-full sm:max-w-[328px]"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leadingIcon="Search"
              trailingIcon={search.length > 0 ? "Close" : undefined}
              onClickTrailing={
                search.length > 0 ? () => setSearch("") : undefined
              }
            />
            <button
              type="button"
              className="prod-btn-base prod-btn-secondary flex items-center flex-shrink-0 ms-0 sm:ms-[16px] mt-[16px] sm:mt-0"
            >
              <span>Download User Manual</span>
              <Icon
                iconName="Download"
                height="20px"
                width="20px"
                fill="#8693A0"
                className="ms-[8px]"
              />
            </button>
          </div>
        </div>

        <div className="help-container">
          <div className={`table-of-contents ${tocAnimate}`} id="toc">
            <div className="toc-backdrop" onAnimationEnd={handleAnimationEnd}>
              <div className="close" onClick={handleClick}>
                <Icon
                  iconName="Close"
                  height="30px"
                  width="30px"
                  stroke="#FFF"
                  className="icon"
                />
              </div>
            </div>

            {/* TOC WRAPPER */}
            <div className="toc-wrapper">
              <div className="toc-header">Modules</div>
              <ul>
                {TOC.map(({ id, label, hasSubItems, subItems }, i) => {
                  return !hasSubItems ? (
                    <li
                      className="toc-item"
                      key={i}
                      onClick={() => handleSelectSection(id)}
                    >
                      {label}
                    </li>
                  ) : (
                    <Fragment key={i}>
                      <li
                        className="toc-item"
                        onClick={() => handleSelectSection(id)}
                      >
                        {label}
                      </li>
                      {subItems.map(({ id, label }, i) => {
                        const isLast = i == subItems.length - 1;
                        return (
                          <li
                            className={`toc-sub-item ${
                              isLast ? "mb-[16px]" : ""
                            }`}
                            key={i}
                            onClick={() => handleSelectSection(id)}
                          >
                            <Icon
                              iconName={isLast ? "ListEnd" : "List"}
                              height={isLast ? "31px" : "52px"}
                              width="10px"
                              fill="#CCC"
                              className="icon"
                            />
                            <span>{label}</span>
                          </li>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* TOC Toggler */}
          <div className="toc-toggler">
            <div className="toggler-button" onClick={handleClick}>
              <Icon
                iconName="UnorderedList"
                stroke="#000"
                className="icon"
                height="24px"
                width="24px"
              />
            </div>
          </div>
          {/* HELP CONTENT */}
          <div className="help-content">
            {getContent().map(
              ({ sectionName, sectionId, description, subSections }, i) => {
                return (
                  <div key={i} className="help-content-section" id={sectionId}>
                    <p className="help-content-heading">{sectionName}</p>
                    {description.map(({ sectionDesc, sectionImage }, i) => {
                      return (
                        <Fragment key={i}>
                          <p className="help-content-desc">
                            <Highlighter
                              highlightClassName="bg-[#FFE81A] text-[#000] font-medium rounded-[2px]"
                              searchWords={[search]}
                              autoEscape={true}
                              textToHighlight={sectionDesc}
                            />
                          </p>
                          {sectionImage}
                        </Fragment>
                      );
                    })}
                    {subSections &&
                      subSections.map(
                        ({ sectionId, sectionName, description }, i) => {
                          return (
                            <Fragment key={i}>
                              <p
                                className="help-content-subheading"
                                id={sectionId}
                              >
                                {sectionName}
                              </p>
                              {description.map(
                                ({ sectionDesc, sectionImage }, i) => {
                                  return (
                                    <Fragment key={i}>
                                      <p className="help-content-desc">
                                        <Highlighter
                                          highlightClassName="bg-[#FFE81A] text-[#000] font-medium rounded-[2px]"
                                          searchWords={[search]}
                                          autoEscape={true}
                                          textToHighlight={sectionDesc}
                                        />
                                      </p>
                                      {sectionImage}
                                    </Fragment>
                                  );
                                }
                              )}
                            </Fragment>
                          );
                        }
                      )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
};
export default Help;

const SampleImage = () => {
  return <div className="sample-image"></div>;
};
