using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class ApiClient : MonoBehaviour {
    public string baseUrl = "https://ORQUESTADOR:8000"; //IMPORTANTE
    public static ApiClient Instance;

    void Awake() {
        if (Instance == null) { Instance = this; DontDestroyOnLoad(gameObject); }
        else Destroy(gameObject);
    }

    public IEnumerator PostMultipart(string path, byte[] bytes, string fieldName, System.Action<UnityWebRequest> onComplete) {
        var url = $"{baseUrl}{path}";
        WWWForm form = new WWWForm();
        form.AddBinaryData(fieldName, bytes, "audio.wav", "audio/wav");
        using (var req = UnityWebRequest.Post(url, form)) {
            req.downloadHandler = new DownloadHandlerBuffer();
            yield return req.SendWebRequest();
            onComplete?.Invoke(req);
        }
    }
}
