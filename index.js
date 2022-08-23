const { Client, Location, List, Buttons } = require('whatsapp-web.js');
var qrcode = require('qrcode-terminal');

const client = new Client();

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: false }
// });

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true }, function (qrcode) {
        console.log(qrcode)
    });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('Doni Wahyu Saputra');

    }
    else if (msg.body === '!menu') {
        msg.reply(`
        Umum
        1. !jadwal
        2. !siswa
        4. !pemilik
        5. !sendto
        6. !mediainfo
        7. !quoteinfo
        8. !lokasi
        9. !status
        10. !archive
        11. !pin
        12. !resendmedia
        13. !del

        
        Grup
        1. !infogrup
        2. !join
        3. !subject
        4. !desc

        React
        1. !love
        2. !lol
        3. !angry
        4. !like

        Bot Info 
        1. !infobot
        2. !jmlhpsnbot
        
        Fitur Lainnya 
        1. !tombol
        2. !list 
        3. 
        `)
    }
    else if (msg.body === '!jadwal') {
        msg.reply(`
        *Jadwal XI-TKJ*
        Senin:
        - PAI
        - B.IND
        - PKK
        - MTK
            
        Selasa:
        - FULL PRODUKTIF
            
        Rabu:
        - FULL PRODUKTIF
            
        Kamis:
        - PROFUKTIF
        - B.ING
        - PKK
        - OLAHRAGA
            
        Jumat:
        - B.IND
        - PKK
        - MTK
        - PKN
        `);
    } 
    else if (msg.body === '!siswa') {
        msg.reply(`
        *Nama-Nama Siswa TKJ*
        1. Adit 
        2. Naufal
        3. Radit
        4. Rizki
        5. Doni 
        6. Rafly GD
        7. Andhika
        8. Farra
        9. Danu  
        10. Ridho
        11. Agung 
        12. Miftahul 
        13. Singgih 
        14. Rangga
        15. Ade
        16. Rafly KCL 
        17. Vito
        18. Arfan
        19. Wigananda
        20. Andrean
        21. Zibran
        `);
    } 
    else if (msg.body === '!pemilik') {
        // Send a new message to the same chat
        client.sendMessage(msg.from,  
            `Nama Panggilan : Doni
            Nama Lengkap : Doni Wahyu Saputra
            Nomor Telepon : 085773532495
            Email : doniwahsap@gmail.com`
        );

    } else if (msg.body.startsWith('!sendto ')) {
        // Direct send a new message to specific id
        let number = msg.body.split(' ')[1];
        let messageIndex = msg.body.indexOf(number) + number.length;
        let message = msg.body.slice(messageIndex, msg.body.length);
        number = number.includes('@c.us') ? number : `${number}@c.us`;
        let chat = await msg.getChat();
        chat.sendSeen();
        client.sendMessage(number, message);

    } else if (msg.body.startsWith('!subject ')) {
        // Change the group subject
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newSubject = msg.body.slice(9);
            chat.setSubject(newSubject);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body.startsWith('!jmlhpsnbot ')) {
        // Replies with the same message
        msg.reply(msg.body.slice(6));
    } 
    
    // merubah deskripsi grup 
    else if (msg.body.startsWith('!desc ')) {
        // Change the group description
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newDescription = msg.body.slice(6);
            chat.setDescription(newDescription);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } 
    // else if (msg.body === '!leave') {
    //     // Leave the group
    //     let chat = await msg.getChat();
    //     if (chat.isGroup) {
    //         chat.leave();
    //     } else {
    //         msg.reply('This command can only be used in a group!');
    //     }
    // } 
    // else if (msg.body === '!leave') {
    //     // Leave the group
    //     let chat = await msg.getChat();
    //     if (chat.isGroup) {
    //         let clientleave = client.chat 
    //         clientleave.leave();
    //     } else {
    //         msg.reply('This command can only be used in a group!');
    //     }
    // } 
    else if (msg.body.startsWith('!join ')) {
        const inviteCode = msg.body.split(' ')[1];
        try {
            await client.acceptInvite(inviteCode);
            msg.reply('Joined the group!');
        } catch (e) {
            msg.reply('That invite code seems to be invalid.');
        }
    } else if (msg.body === '!infogrup') {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`
                *Group Details*
                Name: ${chat.name}
                Description: ${chat.description}
                Created At: ${chat.createdAt.toString()}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}
            `);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body === '!chats') {
        const chats = await client.getChats();
        client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
    } else if (msg.body === '!infobot') {
        let info = client.info;
        client.sendMessage(msg.from, `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.wid.user}
            Platform: ${info.platform}
        `);
    } else if (msg.body === '!mediainfo' && msg.hasMedia) {
        const attachmentData = await msg.downloadMedia();
        msg.reply(`
            *Media info*
            MimeType: ${attachmentData.mimetype}
            Filename: ${attachmentData.filename}
            Data (length): ${attachmentData.data.length}
        `);
    } else if (msg.body === '!quoteinfo' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();

        quotedMsg.reply(`
            ID: ${quotedMsg.id._serialized}
            Type: ${quotedMsg.type}
            Author: ${quotedMsg.author || quotedMsg.from}
            Timestamp: ${quotedMsg.timestamp}
            Has Media? ${quotedMsg.hasMedia}
        `);
    } else if (msg.body === '!resendmedia' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const attachmentData = await quotedMsg.downloadMedia();
            client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
        }
    } 

    // terdapat kerroran disini 
    else if (msg.body === '!lokasi') {
        msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
    } 
    else if (msg.location) {
        msg.reply(msg.location);
    } 
    else if (msg.body.startsWith('!status ')) {
        const newStatus = msg.body.split(' ')[1];
        await client.setStatus(newStatus);
        msg.reply(`Status was updated to *${newStatus}*`);
    } 
    else if (msg.body === '!mention') {
        const contact = await msg.getContact();
        const chat = await msg.getChat();
        chat.sendMessage(`Hi @${contact.number}!`, {
            mentions: [contact]
        });
    } 
    else if (msg.body === '!del') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.delete(true);
            } else {
                msg.reply('I can only delete my own messages');
            }
        }
    } else if (msg.body === '!pin') {
        const chat = await msg.getChat();
        await chat.pin();
    } else if (msg.body === '!archive') {
        const chat = await msg.getChat();
        await chat.archive();
    } else if (msg.body === '!mute') {
        const chat = await msg.getChat();
        // mute the chat for 20 seconds
        const unmuteDate = new Date();
        unmuteDate.setSeconds(unmuteDate.getSeconds() + 20);
        await chat.mute(unmuteDate);
    } else if (msg.body === '!typing') {
        const chat = await msg.getChat();
        // simulates typing in the chat
        chat.sendStateTyping();
    } else if (msg.body === '!recording') {
        const chat = await msg.getChat();
        // simulates recording audio in the chat
        chat.sendStateRecording();
    } else if (msg.body === '!clearstate') {
        const chat = await msg.getChat();
        // stops typing or recording in the chat
        chat.clearState();
    } else if (msg.body === '!jumpto') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            client.interface.openChatWindowAt(quotedMsg.id._serialized);
        }
    } 
    else if (msg.body === '!tombol') {
        let button = new Buttons('Button body', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'title', 'footer');
        client.sendMessage(msg.from, button);
    }
    else if (msg.body === '!list') {
        let sections = [{ title: 'sectionTitle', rows: [{ title: 'ListItem1', description: 'desc' }, { title: 'ListItem2' }] }];
        let list = new List('List body', 'btnText', sections, 'Title', 'footer');
        client.sendMessage(msg.from, list);
    } 
    else if (msg.body === '!like') {
        msg.react('👍');
    }
    else if (msg.body === '!love') {
        msg.react('❤️');
    }
    else if (msg.body === '!angry') {
        msg.react('😡');
    }
    else if (msg.body === '!lol') {
        msg.react('🤣');
    }
});

client.on('message_create', (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
        // do stuff here
    }
});

client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log(after); // message after it was deleted.
    if (before) {
        console.log(before); // message before it was deleted.
    }
});

client.on('message_revoke_me', async (msg) => {
    // Fired whenever a message is only deleted in your own view.
    console.log(msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if (ack == 3) {
        // The message was read
    }
});

client.on('group_join', (notification) => {
    // User has joined or been added to the group.
    console.log('join', notification);
    notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
    // User has left or been kicked from the group.
    console.log('leave', notification);
    notification.reply('User left.');
});

client.on('group_update', (notification) => {
    // Group picture, subject or description has been updated.
    console.log('update', notification);
});

client.on('change_state', state => {
    console.log('CHANGE STATE', state);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});
client.initialize();