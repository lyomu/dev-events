import connectDB from "@/lib/mongodb";
import { connect } from "http2";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { v2 as cloudinary } from 'cloudinary';

export async function POST (req: NextRequest) {
    try { 
        await connectDB();

        const formData = await req.formData();

        let event;

        const file = formData.get('image') as File;

        if (!file || typeof (file as any).arrayBuffer !== 'function') {
            return NextResponse.json({ message: 'Invalid image file format' }, { status: 400 });
        }

        try {
            event = Object.fromEntries(formData.entries());
            // Remove the file object from event data since it can't be serialized to MongoDB
            delete event.image;
        } catch (e) {
            return NextResponse.json({ message: 'Invalid form data', error: 'Could not parse form data' }, { status: 400 });
        }

        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if(error) return reject(error);

                resolve(results);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;


        const createdEvent = await Event.create(event);
        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    }catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event creation failed', error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}