import React, { useRef, useState, useEffect } from "react";

import {
    Box,
    Stack,
    Button,
    Select,
    Divider,
    MenuItem,
    TextField,
    InputLabel,
    FormControl,
} from "@mui/material";

import DialogSelectWaterMarked from "./dialog-select-water-marked";

/* =======================
   TYPES
======================= */

const THAI_FONTS = [
    { label: "Sarabun (ทางการ อ่านง่าย)", value: "Sarabun" },
    { label: "Prompt (โมเดิร์น)", value: "Prompt" },
    { label: "Kanit (หัวสมัยใหม่)", value: "Kanit" },
    { label: "Anuphan (เรียบหรู)", value: "Anuphan" },
    { label: "Chakra Petch (เทคโนโลยี)", value: "Chakra Petch" }
];

interface CanvasText {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    fontWeight: number | 'normal' | 'bold';
}

interface Props {
    imageUrl: string;
    imageOrientation: string;
    isWatermarked?: boolean;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    previewUrl: string;
}

/* =======================
   HELPERS
======================= */

const getCanvasPos = (
    e: MouseEvent,
    canvas: HTMLCanvasElement
) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
};

/* =======================
   COMPONENT
======================= */

const WatermarkedCanvasEditor: React.FC<Props> = ({
    imageUrl,
    imageOrientation,
    isWatermarked = true,
    canvasRef,
    previewUrl
}) => {

    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const baseImageRef = useRef<HTMLImageElement | null>(null);
    const watermarkRef = useRef<HTMLImageElement | null>(null);

    const [isOpenWatermarkDialog, setIsOpenWatermarkDialog] = useState(false);
    const [selectWatermark, setSelectWatermark] = useState<string>('/assets/watermark/watermark_tilt6_black_3024x4032.png');
    const [globalAlphaWatermark, setGlobalAlphaWatermark] = useState(0.5);
    const [selectedText, setSelectedText] = useState<string | null>("t1");

    const dragRef = useRef<{
        id: string | null;
        offsetX: number;
        offsetY: number;
    }>({ id: null, offsetX: 0, offsetY: 0 });

    const rafRef = useRef<number | null>(null);

    const [texts, setTexts] = useState<CanvasText[]>([
        {
            id: "t1",
            text: "CONFIDENTIAL",
            x: 120,
            y: 120,
            fontSize: 80,
            fontFamily: "Sarabun",
            color: "rgba(251, 255, 12, 0.6)",
            fontWeight: 400
        }
    ]);

    /* =======================
       LOAD IMAGES (ONCE)
    ======================= */

    useEffect(() => {
        console.log(selectWatermark);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctxRef.current = ctx;

        let cancelled = false;

        const load = async () => {

            const base = new Image();
            base.crossOrigin = "anonymous";
            base.src = imageUrl;
            await base.decode();
            if (cancelled) return;

            baseImageRef.current = base;

            const wmUrl =
                imageOrientation === "landscape"
                    ? selectWatermark
                    : selectWatermark;

            if (wmUrl) {
                const wm = new Image();
                wm.crossOrigin = "anonymous";
                wm.src = wmUrl;
                await wm.decode();
                watermarkRef.current = wm;
            } else {
                watermarkRef.current = null;
            }

            initCanvasSize(base);
            redraw();
        };

        load();
        // eslint-disable-next-line consistent-return
        return () => {
            cancelled = true;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageUrl, selectWatermark, setSelectWatermark, imageOrientation]);

    /* =======================
       INIT CANVAS SIZE
    ======================= */

    const initCanvasSize = (img: HTMLImageElement) => {
        const canvas = canvasRef.current!;
        const maxWidth = 1500;

        let w = img.width;
        let h = img.height;

        if (w > maxWidth) {
            const ratio = w / h;
            w = maxWidth;
            h = Math.round(maxWidth / ratio);
        }

        canvas.width = w;
        canvas.height = h;
    };

    /* =======================
       REDRAW (SYNC ONLY)
    ======================= */

    const redraw = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        const base = baseImageRef.current;

        if (!canvas || !ctx || !base) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // base image
        ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

        // watermark
        if (isWatermarked && watermarkRef.current) {
            ctx.globalAlpha = globalAlphaWatermark;
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(
                watermarkRef.current,
                0,
                0,
                canvas.width,
                canvas.height
            );
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
        }

        // texts
        texts.forEach(t => {
            ctx.font = `${t.fontWeight} ${t.fontSize}px ${t.fontFamily}`;
            ctx.fillStyle = t.color;
            ctx.textBaseline = "top";
            ctx.fillText(t.text, t.x, t.y);
        });
    };

    const scheduleRedraw = () => {
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            redraw();
            rafRef.current = null;
        });
    };

    /* =======================
       DRAG LOGIC
    ======================= */

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        const hitTest = (t: CanvasText, x: number, y: number) => {
            ctx.font = `${t.fontSize}px ${t.fontFamily}`;
            const w = ctx.measureText(t.text).width;
            const h = t.fontSize;
            return x >= t.x && x <= t.x + w && y >= t.y && y <= t.y + h;
        };

        const onDown = (e: MouseEvent) => {
            const { x, y } = getCanvasPos(e, canvas);

            for (let i = texts.length - 1; i >= 0; i -= 1) {
                const t = texts[i];
                if (hitTest(t, x, y)) {
                    dragRef.current = {
                        id: t.id,
                        offsetX: x - t.x,
                        offsetY: y - t.y
                    };
                    setSelectedText(t.id);
                    return;
                }
            }
        };

        const onMove = (e: MouseEvent) => {
            const drag = dragRef.current;
            if (!drag.id) return;

            const { x, y } = getCanvasPos(e, canvas);

            setTexts(prev => {
                const next = prev.map(t =>
                    t.id === drag.id
                        ? {
                            ...t,
                            x: x - drag.offsetX,
                            y: y - drag.offsetY
                        }
                        : t
                );
                return next;
            });

            scheduleRedraw();
        };

        const onUp = () => {
            dragRef.current.id = null;
        };

        canvas.addEventListener("mousedown", onDown);
        canvas.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);

        // eslint-disable-next-line consistent-return
        return () => {
            canvas.removeEventListener("mousedown", onDown);
            canvas.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [texts]);

    /* =======================
       REDRAW WHEN TEXT CHANGE
    ======================= */

    useEffect(() => {
        scheduleRedraw();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [texts, globalAlphaWatermark, selectWatermark, setSelectWatermark]);

    /* =======================
       UI ACTIONS
    ======================= */

    const activeText = texts.find(t => t.id === selectedText);

    const updateActive = (patch: Partial<CanvasText>) => {
        if (!selectedText) return;
        setTexts(prev =>
            prev.map(t =>
                t.id === selectedText ? { ...t, ...patch } : t
            )
        );
    };

    const addText = () => {
        setTexts(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                text: "NEW TEXT",
                x: 100,
                y: 100,
                fontSize: 80,
                fontFamily: "Sarabun",
                color: "#000000",
                fontWeight: 400
            }
        ]);
    };

    const deleteSelectedText = () => {
        if (!selectedText) return;

        setTexts((prev) => prev.filter((t) => t.id !== selectedText));
        setSelectedText(null);
    };

    /* =======================
       RENDER
    ======================= */

    const onSelectWatermark = (url: string) => {
        setSelectWatermark(url);
        setIsOpenWatermarkDialog(false);
    };

    return (
        <>
            <Stack spacing={2}>
                {/* Controls */}
                <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" justifyContent="flex-start">
                    <Button variant="contained" onClick={addText} size="small" sx={{ width: 100, height: 36 }}>
                        เพิ่มข้อความ
                    </Button>
                    <Button
                        color="error"
                        variant="outlined"
                        disabled={!selectedText}
                        onClick={deleteSelectedText}
                    >
                        ลบข้อความ
                    </Button>

                    <TextField
                        size="small"
                        label="Text"
                        sx={{ width: 300 }}
                        value={activeText?.text || ""}
                        onChange={e =>
                            updateActive({ text: e.target.value })
                        }
                    />
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Font</InputLabel>
                        <Select
                            label="Font"
                            value={activeText?.fontFamily || "Sarabun"}
                            onChange={(e) =>
                                updateActive({
                                    fontFamily: e.target.value
                                })
                            }
                        >
                            {THAI_FONTS.map(font => (
                                <MenuItem
                                    key={font.value}
                                    value={font.value}
                                    sx={{ fontFamily: font.value }}
                                >
                                    {font.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        size="small"
                        type="number"
                        label="Size"
                        sx={{ width: 70 }}
                        value={activeText?.fontSize || 80}
                        onChange={e =>
                            updateActive({
                                fontSize: Number(e.target.value)
                            })
                        }
                    />
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Font Weight</InputLabel>
                        <Select
                            label="Font Weight"
                            size="small"
                            value={activeText?.fontWeight || 400}
                            onChange={(e) =>
                                updateActive({ fontWeight: e.target.value as number })
                            }
                        >
                            <MenuItem value={300}>Light</MenuItem>
                            <MenuItem value={400}>Regular</MenuItem>
                            <MenuItem value={500}>Medium</MenuItem>
                            <MenuItem value={600}>Semi Bold</MenuItem>
                            <MenuItem value={700}>Bold</MenuItem>
                            <MenuItem value={800}>Extra Bold</MenuItem>
                        </Select>
                    </FormControl>

                    <Box>
                        <input
                            type="color"
                            style={{ width: 60, height: 38 }}
                            value={activeText?.color || '#000000'}
                            onChange={e =>
                                updateActive({ color: e.target.value })
                            }
                        />
                    </Box>

                </Stack>
                <Divider sx={{ borderStyle: 'dashed', mt: 0.5, mb: 0.5 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" justifyContent="flex-start">
                    <Button variant="contained" onClick={() => setIsOpenWatermarkDialog(true)} size="small" sx={{ width: 200, height: 36 }}>
                        เลือก Watermark
                    </Button>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Opacity Watermark</InputLabel>
                        <Select
                            label="Opacity Watermark"
                            size="small"
                            value={globalAlphaWatermark || 0.5}
                            onChange={(e) =>
                                setGlobalAlphaWatermark(e.target.value as number)
                            }
                        >
                            <MenuItem value={0.3}>น้อย</MenuItem>
                            <MenuItem value={0.5}>ปานกลาง</MenuItem>
                            <MenuItem value={0.7}>มาก</MenuItem>
                            <MenuItem value={1}>เต็ม</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>

                {/* Canvas */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 3, md: 6, lg: 10 } }}>
                    <Box
                        sx={{
                            width: 1,
                            maxWidth: imageOrientation === 'landscape' ? '700px' : '400px'
                        }}
                    >
                        <Box
                            component="img"
                            src={previewUrl}
                            alt="preview"
                            sx={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: 2,
                                display: 'block',
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            width: 1,
                            maxWidth:
                                imageOrientation === "landscape"
                                    ? "700px"
                                    : "400px"
                        }}
                    >
                        <canvas
                            ref={canvasRef}
                            style={{
                                width: "100%",
                                borderRadius: 16,
                                cursor: "move",
                                userSelect: "none"
                            }}
                        />
                    </Box>
                </Box>
            </Stack>
            <DialogSelectWaterMarked open={isOpenWatermarkDialog} onSubmit={onSelectWatermark} />
        </>

    );
};

export default WatermarkedCanvasEditor;
