<?php
// 创建画布（长方形尺寸示例：800x400）
$width = 800;
$height = 400;
$image = imagecreatetruecolor($width, $height);

// 设置背景色（白色）和文字色（深蓝色）
$bgColor = imagecolorallocate($image, 255, 255, 255);
$textColor = imagecolorallocate($image, 0, 72, 144);
imagefill($image, 0, 0, $bgColor);

// 加载字体（需替换为实际字体文件路径）
$fontFile = 'simhei.ttf'; // 黑体字体文件
$fontSize = 72;
$text = "创业分析";

// 计算文字位置（水平居中）
$textBox = imagettfbbox($fontSize, 0, $fontFile, $text);
$textWidth = $textBox[2] - $textBox[0];
$textX = ($width - $textWidth)/2;
$textY = $height/2 + $fontSize/2;

// 绘制文字
imagettftext($image, $fontSize, 0, $textX, $textY, $textColor, $fontFile, $text);

// 输出为JPG
header('Content-Type: image/jpeg');
imagejpeg($image);
imagedestroy($image);
?>