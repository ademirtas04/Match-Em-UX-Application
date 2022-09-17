import Deso from "deso-protocol";

import {
  GetSingleProfileResponse,
  // PostEntryResponse,
  GetFollowsResponse,
} from "deso-protocol-types";
import { useEffect, useState } from "react";
import { Button } from "../../Components/Button";
import { ProfilePic } from "../../Components/ProfilePic";
// import {ProfilePic} from

const deso = new Deso();
export interface ProfileCardProps {
  publicKey: string;
}
export const ProfileCard = ({ publicKey }: ProfileCardProps) => {
  useEffect(() => {
    getProfile(publicKey);
  }, []);

  const [profilePic, setProfilePic] = useState("");
  const [profile, setProfile] = useState<null | GetSingleProfileResponse>(null);
  const [followerInfo, setFollowers] = useState<null | FollowerInfo>(null);

  const getProfile = async (user: string) => {
    const profile = await deso.user.getSingleProfile({
      PublicKeyBase58Check: user,
    });

    const followers = await deso.social.getFollowsStateless({
      PublicKeyBase58Check: deso.identity.getUserKey() as string,
      GetEntriesFollowingUsername: true,
    });
    const following = await deso.social.getFollowsStateless({
      PublicKeyBase58Check: deso.identity.getUserKey() as string,
    });

    // setPosts(posts.Posts ?? []);
    setProfile(profile);
    setProfilePic(profilePic);
    setFollowers({ following, followers });
  };

  return (
    <div className="flex flex-col bg-slate-500 p-2 text-white rounded-lg">
      <div className="min-w-[1000px]  px-6 mx-auto">
        <div className="flex text-lg font-bold ">
          <ProfilePic publicKey={publicKey as string} />
          <div className="my-auto">
            {profile?.Profile?.Username && "@" + profile?.Profile?.Username}
          </div>
        </div>
        <div> {profile?.Profile?.Description} </div>
        {followerInfo && (
          <FollowerDisplay
            followers={followerInfo.followers}
            following={followerInfo.following}
          />
        )}
      </div>
      <div className="image">
       img
      </div>
    </div>
  );
};

var prompts = ["Fashion: Meet someone with the same colored shoes as you today!", "Political: Meet someone with a different political affiliation than you today!", "Food: Meet someone who ate the same breakfast as you today!", "Sports: Meet someone who supports a rival sports team today!", "Music: Meet someone who enjoys the same music artist as you!", "Movies/TV: Meet someone who has watched Breaking Bad today!", "Interests: Meet someone with a different job than you today!", "Academics: Meet someone who shares the same major as you today!", "Recreation: Meet someone who enjoys the same hobby as you today!", "Language: Meet someone who speaks the same language as you today!", "Demographics: Meet someone from another generation than you today!", "Demographics: Meet someone with a different gender orientation than you today!", "Demographics: Meet someone of a different ethnic background than you today!", "Sustainability: Meet someone using bike transportation today!", "Sustainability: Meet someone planting at a community garden today!"]
var randIndex =  Math.floor(Math.random() * prompts.length); 

const FollowerDisplay = ({ followers, following }: FollowerInfo) => {
  const [post, setPost] = useState("");
  useEffect(() => {}, [post, setPost]);
  return (
    <>
      <div className="flex justify-center font-semibold ">
        <div className="Title">
          {'Your Daily Match Em: '}
        </div>
        <div className="prompt button">
          <Button
            buttonText="New Match 'Em!"
            click={() => update()}
          />
        </div>
      </div>

      
      <div className="flex justify-center font-semibold ">
        <div className="prompt" id = "prompt">
          {}
        </div>
      </div>

      <div className="flex flex-col justify-center py-2">
        <div className="flex justify-center">
          <textarea
            placeholder="Match 'Em Today!"
            value={post}
            onChange={(e: any) => {
              setPost(e.target.value);
            }}
            className="ml-2 min-w-[400px] min-h-[50px] text-black"
          />
        </div>

        <div className="flex justify-center">
          <Button
            buttonText="Create A Post"
            click={async () => {
              console.log(post);
              if (!post) {
                return;
              }
              await deso.posts.submitPost({
                UpdaterPublicKeyBase58Check:
                  deso.identity.getUserKey() as string,
                BodyObj: {
                  Body: post,
                  VideoURLs: [],
                  ImageURLs: [],
                },
              });
              setPost("");
            }}
          />
        </div>

        <div className="flex justify-center font-semibold ">
          <div className="mr-2">
            {followers && `following: ${following.NumFollowers}`}
          </div>
          <div>{followers && `followers: ${followers.NumFollowers}`}</div>
        </div>

        
      </div>
    </>
  );
};

type FollowerInfo = {
  followers: GetFollowsResponse;
  following: GetFollowsResponse;
};

function update(){
  
  const prompt = document.getElementById("prompt");
  const p = document.createElement("p");
  randIndex =  Math.floor(Math.random() * prompts.length); 
  p.textContent = prompts[randIndex];
  if(prompt?.children[0] == null){
    prompt?.append(p);
  } else {
    prompt?.replaceChild(p, prompt?.children[0]);
  }   
}

