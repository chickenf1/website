const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// --- CẤU HÌNH ---
const DISCORD_TOKEN = 'MTQ1NDczOTY1MTQ5MDQ4NDM3Nw.G20bzH.972TiqYixq8BhHhLrLZ4Pz86-IeA810ZUd4cbY';
const CHANNEL_ID = '1413281315834564668';

// Cấu hình Cloudinary (Kho lưu trữ video vĩnh viễn miễn phí)
cloudinary.config({ 
  cloud_name: 'ml_default', 
  api_key: '628976731846143', 
  api_secret: '_B6PTtkdzcA4tNtBI6UsCvt1uRw' 
});

const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds] });

client.on('messageCreate', async (message) => {
    // Chỉ lấy video trong đúng Channel ID và không phải từ Bot
    if (message.channelId !== CHANNEL_ID || message.author.bot) return;

    if (message.attachments.size > 0) {
        message.attachments.forEach(async (attachment) => {
            const isVideo = attachment.contentType?.includes('video');
            
            if (isVideo) {
                console.log(`Phát hiện video: ${attachment.name}`);
                
                // Tải và đẩy trực tiếp lên Cloudinary (Không tốn dung lượng hosting của bạn)
                try {
                    const upload = await cloudinary.uploader.upload(attachment.url, { 
                        resource_type: "video",
                        public_id: `gallery/${attachment.name}`
                    });
                    console.log("Đã lưu vĩnh viễn tại:", upload.secure_url);
                    
                    // (Tùy chọn) Bạn có thể lưu link này vào Database hoặc file JSON trên hosting của mình tại đây
                } catch (error) {
                    console.error("Lỗi upload:", error);
                }
            }
        });
    }
});


client.login(DISCORD_TOKEN);
