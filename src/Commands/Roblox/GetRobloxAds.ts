import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Command } from "../../CommandInterface";

import axios from "axios";
import { parse } from 'node-html-parser';

const AdEndpoints = [
    "https://www.roblox.com/user-sponsorship/1",
    "https://www.roblox.com/user-sponsorship/2",
    "https://www.roblox.com/user-sponsorship/3",
]

type AdImage = {
    link?: string,
    image?: string,
    alt?: string,
}

async function getAd(Endpoint: any): Promise<AdImage> {
    const HtmlContent = await axios({
        method: "GET",
        url: Endpoint,
        validateStatus: () => true,
    })

    if (HtmlContent.status == 200) {
        // janky. probably will break when roblox revamps ads.
        // but oh well.
        const root = parse(HtmlContent.data)
        const a = root.querySelector("a")
        const img = a?.querySelector("img")

        return {
            link: a?.attrs.href,
            image: img?.attrs.src + ".jpg",
            alt: a?.attrs.title,
        }
    } else {
        throw new Error("Endpoint returned" + HtmlContent.status.toString())
    }
}

export async function getAds(): Promise<AdImage[]> {
    const Ads = []

    var Count = 0

    // ts is the reason i get scared from just
    // the word "async"
    for await (const endpoint of AdEndpoints) {
        const Ad = await getAd(endpoint)
        Ads[Count] = Ad;

        // this shit has been returning only 1 ad because i forgot to add count++
        // god i wish loops in js were like lua loops.
        // please i want to know the index when looping.
        // i dont want to keep a external variable.
        Count++
    }

    return Ads;
}

async function run(interaction: CommandInteraction) {
    var Count = 0;
    const bruteforceSetting = interaction.options.get("bruteforce")
    const shouldBruteForce = bruteforceSetting != null;

    try {
        if (shouldBruteForce != true) {
            const Ads = await getAds();

            Count = 0;
            const Links = []

            for (const ad of Ads) {
                const Link = ad.link
                Links[Count] = `[Redirect for Ad #${Count}]${ad.link}`
                Count++
            }

            // Unknown Interaction MY ASS
            await interaction.followUp({
                files: Ads.map(Ad => (Ad as any).image),
                ephemeral: true,
                flags: 1 << 6,
                content: Links.join("\n"),
            }).catch(err => {
                console.log("probably got unknown interaction: " + err)
            })
        } else if (shouldBruteForce == true) {
            const invalidAds: string[] = []

            for (let i = 0; i < 500; i++) {
                const ads = await getAds();

                for (const ad of ads) {
                    if (ad.alt?.toLowerCase().includes(bruteforceSetting?.value as string)) {
                        if (invalidAds.includes(ad.link as string) == true) {
                            continue;
                        }
                        invalidAds.push(ad.link as string);


                        console.log(`Found match: ${ad.alt}`)
                        await interaction.followUp({
                            content: `Bruteforce found! [${ad.alt}](${ad.link}) [Image](${ad.image})`
                        })
                        break;
                    } else {
                        console.log(`Nope: ${ad.alt}`)
                    }
                }
            }
        }
    } catch (err) {
        console.log(`Error while trying to get roblox ads: ${err}`)
        throw err;
    }
}

export const GetRobloxAds: Command = {
    name: "get-roblox-ads",
    description: "Gets a random currently running Roblox ad.",
    deferReply: true,
    ownerOnly: true,
    options: [
        {
            name: "bruteforce",
            type: ApplicationCommandOptionType.String,
            required: false,
            description: "Bruteforces ads until a specific term is found."
        }
    ],
    run: run,
}