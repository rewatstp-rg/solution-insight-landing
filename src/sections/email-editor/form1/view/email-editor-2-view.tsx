import { useRef, useEffect } from "react";
// import EmailEditor  from "@editex/react-email-editor";

import { Button, Container } from "@mui/material";

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import '../test.css';

// import {
//     DndContext,
//     DragOverlay,
//     closestCorners,
//     KeyboardSensor,
//     PointerSensor,
//     useSensor,
//     useSensors
// } from "@dnd-kit/core";
// import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

// import ContainerDBD from "../Container-dnd";
// import { Item } from "../sortable-dnd";

// const wrapperStyle: any = {
//     display: "flex",
//     flexDirection: "row"
// };


// const defaultAnnouncements = {
//     onDragStart(id: any) {
//         console.log(`Picked up draggable item ${id}.`);
//     },
//     onDragOver(id: any, overId: any) {
//         if (overId) {
//             console.log(
//                 `Draggable item ${id} was moved over droppable area ${overId}.`
//             );
//             return;
//         }

//         console.log(`Draggable item ${id} is no longer over a droppable area.`);
//     },
//     onDragEnd(id: any, overId: any) {
//         if (overId) {
//             console.log(
//                 `Draggable item ${id} was dropped over droppable area ${overId}`
//             );
//             return;
//         }

//         console.log(`Draggable item ${id} was dropped.`);
//     },
//     onDragCancel(id: any) {
//         console.log(`Dragging was cancelled. Draggable item ${id} was dropped.`);
//     }
// };


export default function EmailEditor2View() {

    // const demo: any[] = [{ "name": "Column", "key": "column", "type": "full", "styles": { "key": "column", "desktop": { "backgroundColor": "transparent", "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "contentBackground": "#fff" }, "mobile": {} }, "children": [{ "name": "Content", "key": "content", "width": "100%", "styles": { "key": "column", "desktop": { "backgroundColor": "transparent", "paddingTop": 0, "paddingLeft": 0, "paddingRight": 0, "paddingBottom": 0, "contentBackground": "transparent" }, "mobile": {} }, "children": [{ "name": "Image", "key": "image", "src": "https://run.checkrace.com/shared-image/event-image/psmh25/banner/20240917152908_20240917092705_PSMH25_KV-1200x800.jpg", "alt": "Image", "type": "link", "linkURL": "", "contentStyles": { "desktop": { "paddingTop": 12, "paddingBottom": 12, "paddingLeft": 12, "paddingRight": 12, "textAlign": "center" }, "mobile": {} }, "styles": { "desktop": { "width": "auto" }, "mobile": {} }, "styleConfig": { "className": "image-0", "desktop": "width:auto;", "mobile": "" }, "contentStyleConfig": { "className": "image-content-0", "desktop": "padding-top:12px;padding-bottom:12px;padding-left:12px;padding-right:12px;text-align:center;", "mobile": "" } }, { "name": "Heading", "key": "heading", "text": "ข้อมูลทั่วไป", "type": "h1", "styles": { "desktop": { "fontSize": 22, "lineHeight": "140%", "fontFamily": "sans-serif", "paddingTop": 12, "paddingBottom": 12, "paddingLeft": 12, "paddingRight": 12, "textAlign": "left", "fontWeight": "bold" }, "mobile": {} }, "styleConfig": { "className": "heading-1", "desktop": "font-size:22px;line-height:140%;font-family:sans-serif;padding-top:12px;padding-bottom:12px;padding-left:12px;padding-right:12px;text-align:left;font-weight:bold;", "mobile": "" } }], "styleConfig": { "className": "content-0", "desktop": "background-color:transparent;", "mobile": "" }, "contentStyleConfig": { "className": "content-content-0", "desktop": "background-color:transparent;", "mobile": "" } }], "styleConfig": { "className": "column-0", "desktop": "background-color:transparent;", "mobile": "" }, "contentStyleConfig": { "className": "column-content-0", "desktop": "background-color:#fff;", "mobile": "" } }];

    const emailEditorRef = useRef<any>(null);
    // const [emailData, setEmailData] = useState<any>([]);
    // const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        // setLoading(true);
        setTimeout(() => {
            // setEmailData(demo);
            // setLoading(false);
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const exportHtml = () => {
        console.log("exportHtml");
        emailEditorRef.current.init()
        const html = emailEditorRef.current.exportHtml();
        const blob = new Blob([html], { type: "text/html" });
        const a = document.createElement("a");
        a.download = "email.html";
        a.href = URL.createObjectURL(blob);
        a.click();
    };

    const showEmailData = () => {
        console.log("showEmailData");
        // setLoading(true);
        setTimeout(() => {
            // setLoading(false);
        }, 1000)
        if (emailEditorRef && emailEditorRef?.current) {
            console.log(JSON.stringify(emailEditorRef.current?.blockList));
        }

        // var pageHTML = document.documentElement.outerHTML;
        // console.log("🚀 ~ file: email-editor-2-view.tsx:69 ~ showEmailData ~ pageHTML:", pageHTML)

        // var tempEl = document.createElement('a');

        // tempEl.href = 'data:attachment/text,' + encodeURI(pageHTML);
        // tempEl.target = '_blank';
        // tempEl.download = 'thispage.html';
        // tempEl.click();
        // if (document && document?.getElementById('divToPDF')) {
        //     var pageHTML = document.getElementById('divToPDF').innerHTML;
        //     let data = new Blob([pageHTML], { type: 'data:attachment/text,' });
        //     let csvURL = window.URL.createObjectURL(data);
        //     let tempLink = document.createElement('a');
        //     tempLink.href = csvURL;
        //     tempLink.setAttribute('download', 'Graph.html');
        //     tempLink.click();
        // }
    };

    // function allowDrop(ev: any) {
    //     ev.preventDefault();
    // }

    // function drag(ev: any) {
    //     ev.dataTransfer.setData("text", ev.target.id);
    // }

    // function drop(ev: any) {
    //     ev.preventDefault();
    //     var data = ev.dataTransfer.getData("text");
    //     ev.target.appendChild(document.getElementById(data));
    // }

    // const [items, setItems] = useState<any>({
    //     root: ["1", "2", "3"],
    //     container1: ["4", "5", "6"],
    //     container2: ["7", "8", "9"],
    //     container3: []
    // });
    // const [activeId, setActiveId] = useState<any>();

    // const sensors = useSensors(
    //     useSensor(PointerSensor),
    //     useSensor(KeyboardSensor, {
    //         coordinateGetter: sortableKeyboardCoordinates
    //     })
    // );

    // function findContainer(id: any) {
    //     if (id in items) {
    //         return id;
    //     }

    //     return Object.keys(items).find((key) => items[key].includes(id));
    // }

    // function handleDragStart(event: any) {
    //     const { active } = event;
    //     const { id } = active;

    //     setActiveId(id);
    // }

    // function handleDragOver(event: any) {
    //     const { active, over, draggingRect } = event;
    //     const { id } = active;
    //     const { id: overId } = over;

    //     // Find the containers
    //     const activeContainer = findContainer(id);
    //     const overContainer = findContainer(overId);

    //     if (
    //         !activeContainer ||
    //         !overContainer ||
    //         activeContainer === overContainer
    //     ) {
    //         return;
    //     }

    //     setItems((prev: any) => {
    //         const activeItems = prev[activeContainer];
    //         const overItems = prev[overContainer];

    //         // Find the indexes for the items
    //         const activeIndex = activeItems.indexOf(id);
    //         const overIndex = overItems.indexOf(overId);

    //         let newIndex;
    //         if (overId in prev) {
    //             // We're at the root droppable of a container
    //             newIndex = overItems.length + 1;
    //         } else {
    //             const isBelowLastItem =
    //                 over &&
    //                 overIndex === overItems.length - 1 &&
    //                 draggingRect?.offsetTop > over?.rect?.offsetTop + over?.rect?.height;

    //             const modifier = isBelowLastItem ? 1 : 0;

    //             newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    //         }

    //         return {
    //             ...prev,
    //             [activeContainer]: [
    //                 ...prev[activeContainer].filter((item: any) => item !== active.id)
    //             ],
    //             [overContainer]: [
    //                 ...prev[overContainer].slice(0, newIndex),
    //                 items[activeContainer][activeIndex],
    //                 ...prev[overContainer].slice(newIndex, prev[overContainer].length)
    //             ]
    //         };
    //     });
    // }

    // function handleDragEnd(event: any) {
    //     const { active, over } = event;
    //     const { id } = active;
    //     const { id: overId } = over;

    //     const activeContainer = findContainer(id);
    //     const overContainer = findContainer(overId);

    //     if (
    //         !activeContainer ||
    //         !overContainer ||
    //         activeContainer !== overContainer
    //     ) {
    //         return;
    //     }

    //     const activeIndex = items[activeContainer].indexOf(active.id);
    //     const overIndex = items[overContainer].indexOf(overId);

    //     if (activeIndex !== overIndex) {
    //         setItems((items: any) => ({
    //             ...items,
    //             [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
    //         }));
    //     }

    //     setActiveId(null);
    // }


    return (
        <Container maxWidth='xl'>
            <CustomBreadcrumbs
                heading="Email Template"
                links={[
                    { name: 'Dashboard Overview', href: paths.dashboard.general.overview },
                    { name: 'Editor' },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <div className="page" >
                <div className="page-header">
                    <Button color="primary" variant="contained" onClick={() => exportHtml()}>Export HTML</Button>
                    <Button color="primary" variant="outlined" onClick={() => showEmailData()}>Show email data</Button>
                </div>
                {/* <div className="page-content">{emailData && !loading ? <EmailEditor ref={emailEditorRef} defaultBlockList={emailData} /> : <>Loading....</>}</div> */}
            </div>



            {/* <br />
            <img id="drag1" src="https://run.checkrace.com/shared-image/event-image/psmh25/banner/20240917152908_20240917092705_PSMH25_KV-1200x800.jpg" draggable="true" onDragStart={(event) => drag(event)} width="336" height="69" /> */}

            {/* <div >
                <html lang="en">
                    <head>
                        <meta charSet="UTF-8" />
                        <link rel="icon" type="image/png" href="/checkrace_LOGO2.png" />
                        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                        <title>Administrator</title>
                    </head>
                    <body>
                        <p>Drag the W3Schools image into the rectangle:</p>
                        <div id="div1" onDrop={(event) => drop(event)} onDragOver={(event) => allowDrop(event)} style={{
                            width: '350px',
                            height: 'auto',
                            padding: '10px',
                            border: '1px solid #aaaaaa'
                        }}></div>
                        <div style={{ color: 'red' }}>
                            test
                        </div>
                    </body>
                </html>
            </div> */}


            {/* <div id='divToPDF'>
                <html lang="en">
                    <head>
                        <meta charSet="UTF-8" />
                        <link rel="icon" type="image/png" href="/checkrace_LOGO2.png" />
                        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                        <title>Administrator</title>
                    </head>
                    <body style={wrapperStyle} >
                        <DndContext
                            // announcements={defaultAnnouncements}
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                        >
                            <ContainerDBD id="root" items={items.root} />
                            <ContainerDBD id="container1" items={items.container1} />
                            <ContainerDBD id="container2" items={items.container2} />
                            <ContainerDBD id="container3" items={items.container3} />
                            <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
                        </DndContext>
                    </body>
                </html>

            </div> */}

        </Container>
    )
}