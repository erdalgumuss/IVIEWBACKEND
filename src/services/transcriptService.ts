import AWS from 'aws-sdk';
import axios from 'axios';

// Amazon Transcribe hizmetini kullanmak için AWS Transcribe istemcisi oluşturuyoruz
const transcribe = new AWS.TranscribeService({
  region: process.env.AWS_REGION,
});

export const getTranscriptFromVideo = async (videoKey: string): Promise<string> => {
  const jobName = `transcribe_${videoKey}`;
  const params = {
    TranscriptionJobName: jobName,
    LanguageCode: 'tr-TR', // Dil kodu: Türkçe
    Media: {
      MediaFileUri: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/${videoKey}`,
    },
    OutputBucketName: process.env.AWS_S3_BUCKET, // Transcribe sonucu bu bucket'a kaydedilecek
  };

  // Transcription işlemini başlatıyoruz
  try {
    await transcribe.startTranscriptionJob(params).promise();
  } catch (error) {
    console.error('Transcription işlemi başlatılamadı:', error);
    throw new Error('Transcription işlemi başlatılamadı');
  }

  // Transcription tamamlanana kadar bekleme
  let isCompleted = false;
  const maxRetries = 20; // Maksimum deneme sayısı (örneğin, 20 kez denenecek)
  let retryCount = 0;

  while (!isCompleted && retryCount < maxRetries) {
    try {
      const jobStatus = await transcribe.getTranscriptionJob({ TranscriptionJobName: jobName }).promise();
      if (jobStatus.TranscriptionJob?.TranscriptionJobStatus === 'COMPLETED') {
        isCompleted = true;
      } else if (jobStatus.TranscriptionJob?.TranscriptionJobStatus === 'FAILED') {
        throw new Error('Transcription işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Transcription durumu kontrol edilemedi:', error);
      throw new Error('Transcription durumu kontrol edilemedi');
    }

    // 5 saniye bekliyoruz
    await new Promise(resolve => setTimeout(resolve, 5000));
    retryCount++;
  }

  if (!isCompleted) {
    throw new Error('Transcription işlemi zaman aşımına uğradı');
  }

  // Transcript URL'sini alıyoruz
  const transcriptUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/${videoKey}.json`;

  try {
    const transcriptResponse = await axios.get(transcriptUrl);
    const transcriptData = transcriptResponse.data;
    const transcript = transcriptData.results.transcripts[0].transcript;
    return transcript;
  } catch (error) {
    console.error('Transcript alınamadı:', error);
    throw new Error('Transcript alınamadı');
  }
};
