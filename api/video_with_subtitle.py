#!/usr/bin/python

# This sample executes a search request for the specified search term.
# Sample usage:
#   python search.py --q=surfing --max-results=10
# NOTE: To use the sample, you must provide a developer key obtained
#       in the Google APIs Console. Search for "REPLACE_ME" in this code
#       to find the correct place to provide that key..

import argparse
import json
import os
from youtube_transcript_api import YouTubeTranscriptApi
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


# Set DEVELOPER_KEY to the API key value from the APIs & auth > Registered apps
# tab of
#   https://cloud.google.com/console
# Please ensure that you have enabled the YouTube Data API for your project.

# default search = https://www.googleapis.com/youtube/v3/search?q=test&key=AIzaSyDgWsUP9XT4473Rq5K41rA1V8WpLRzA9bU&part=snippet&maxResults=3
# search next page = https://www.googleapis.com/youtube/v3/search?q=test&key=AIzaSyDgWsUP9XT4473Rq5K41rA1V8WpLRzA9bU&part=snippet&maxResults=3&pageToken=CAMQAA
#
# default # videos = https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&key=AIzaSyDgWsUP9XT4473Rq5K41rA1V8WpLRzA9bU&maxResults=3&regionCode=GB
#
# videoCategories = https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&key=AIzaSyDgWsUP9XT4473Rq5K41rA1V8WpLRzA9bU&regionCode=GB
#
DEVELOPER_KEY = 'AIzaSyDgWsUP9XT4473Rq5K41rA1V8WpLRzA9bU'
YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'

SUBTITLE_VIDEOS_JSON = '{}/subtitle_videos.json'
UNSUBTITLE_VIDEOS_JSON = '{}/unsubtitle_videos.json'
POPULAR_VIDEOS_JSON = '{}/popular.json'
#loadTotalVideos = []
loadSubtitleVideos = []
loadUnsubtitleVideos = []

def loadJsonVideos(regionCode):
    global loadSubtitleVideos, loadUnsubtitleVideos
    if os.path.isfile(SUBTITLE_VIDEOS_JSON.format(regionCode)):
        with open(SUBTITLE_VIDEOS_JSON.format(regionCode), 'r') as fp:
            loadSubtitleVideos = json.load(fp)
    if os.path.isfile(UNSUBTITLE_VIDEOS_JSON.format(regionCode)):
        with open(UNSUBTITLE_VIDEOS_JSON.format(regionCode), 'r') as fp:
            loadUnsubtitleVideos = json.load(fp)

  
def youtube_videos(options):

  regionCode = options.region_code
  loadJsonVideos(regionCode)

  youtube = build(
      YOUTUBE_API_SERVICE_NAME, 
      YOUTUBE_API_VERSION,
      developerKey=DEVELOPER_KEY
      )

  # Call the search.list method to retrieve results matching the specified
  # query term.
  # search_response = youtube.search().list(
  #   q=options.q,
  #   part='id,snippet',
  #   maxResults=options.max_results
  # ).execute()

  videos_response =youtube.videos().list(
    part='snippet',
    chart='mostPopular',
    regionCode=options.region_code,
    maxResults=options.max_results
  ).execute()

  popularVideos = {}
  subtitleVideos = []
  unsubtitleVideos = []
  videos_print = []

  popularVideos['kind'] = videos_response['kind']
  popularVideos['etag'] = videos_response['etag']
  popularVideos['items'] = []


  # Add each result to the appropriate list, and then display the lists of
  # matching videos, channels, and playlists.
  idx = 0
  err = 0
  for video_result in videos_response.get('items', []):
    if video_result['kind'] == 'youtube#video':
      videoId = video_result['id']

      if videoId in loadSubtitleVideos:
        popularVideos['items'].append(video_result)
        subtitleVideos.append(videoId)
        videos_print.append('[%d] old %s (%s)' % (idx, video_result['snippet']['title'], video_result['id']))
        idx += 1
        continue
      if videoId in loadUnsubtitleVideos:
        unsubtitleVideos.append(videoId)
        print("[{0}] old subtitle error ={1}".format(err, videoId))
        err += 1
        continue

      try:
          transcript_list = YouTubeTranscriptApi.list_transcripts(videoId)
      except Exception as e:
          unsubtitleVideos.append(videoId)
          print("[{0}] new subtitle error ={1}".format(err, videoId))
          transcript_list = None
          err += 1

      if transcript_list is not None:
        popularVideos['items'].append(video_result)
        subtitleVideos.append(videoId)
        videos_print.append('[%d] new %s (%s)' % (idx, video_result['snippet']['title'], video_result['id']))
        idx += 1


  nextPageToken = videos_response.get('nextPageToken',None)

  while nextPageToken is not None:

    videos_response =youtube.videos().list(
      part='snippet',
      chart='mostPopular',
      pageToken=nextPageToken,
      regionCode=options.region_code,      
      maxResults=options.max_results
    ).execute()

    for video_result in videos_response.get('items', []):
        if video_result['kind'] == 'youtube#video':
            videoId = video_result['id']

            if videoId in loadSubtitleVideos:
              popularVideos['items'].append(video_result)
              subtitleVideos.append(videoId)
              videos_print.append('[%d] old %s (%s)' % (idx, video_result['snippet']['title'], video_result['id']))
              idx += 1
              continue
            if videoId in loadUnsubtitleVideos:
              unsubtitleVideos.append(videoId)
              print("[{0}] old subtitle error ={1}".format(err, videoId))
              err += 1
              continue

            try:
                transcript_list = YouTubeTranscriptApi.list_transcripts(videoId)
            except Exception as e:
                unsubtitleVideos.append(videoId)              
                print("[{0}] new subtitle error ={1}".format(err, videoId))
                transcript_list = None
                err += 1

            if transcript_list is not None:
                popularVideos['items'].append(video_result)
                subtitleVideos.append(videoId)
                videos_print.append('[%d] new %s (%s)' % (idx, video_result['snippet']['title'], video_result['id']))
                idx += 1

    nextPageToken = videos_response.get('nextPageToken',None)

  totalCount = len(popularVideos['items'])
  popularVideos['pageInfo'] = {'totalResults': totalCount,'resultsPerPage': totalCount}

  if not os.path.isdir(regionCode):
      os.mkdir(regionCode)

  with open(POPULAR_VIDEOS_JSON.format(regionCode), 'w') as fp:
    json.dump(popularVideos, fp)
  with open(SUBTITLE_VIDEOS_JSON.format(regionCode), 'w') as fp:
    json.dump(subtitleVideos, fp)
  with open(UNSUBTITLE_VIDEOS_JSON.format(regionCode), 'w') as fp:
    json.dump(unsubtitleVideos, fp)

  print ('Videos:\n', '\n'.join(videos_print), '\n')


if __name__ == '__main__':

  regionCodes = ['GB','US', 'DE','ES', 'FR', 'IT', 'JP', 'KR', 'PT', 'RU']
  for regionCode in regionCodes:
      print("==> {} started".format(regionCode))
      parser = argparse.ArgumentParser()
      parser.add_argument('--region-code', help='Region Code', default=regionCode)
      parser.add_argument('--max-results', help='Max results', default=50)
      args = parser.parse_args()

      try:
        youtube_videos(args)
      except HttpError as e:
        print ('An HTTP error %d occurred:\n%s' % (e.resp.status, e.content))
