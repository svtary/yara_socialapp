import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react';

const appId = '3601f795150b4df28b7e15fa1b3722d1';
const token =
  '007eJxTYPitOe1adzi3rrSseNQcg+92r+f+OPjJexH/kX+xenecFyQoMBibGRimmVuaGpoaJJmkpBlZJJmnGpqmJRomGZsbGaUYqmkfSmkIZGQIYj/MwAiFID4LQ25iZh4DAwApEh5q';

export const config = { mode: 'rtc', codec: 'vp8', appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = 'main';
